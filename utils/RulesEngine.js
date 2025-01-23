import SelectableRoster from "@/components/SelectableRoster";
import SelectRoster from "@/components/SelectRoster";

export function init(inputFrontEndRules) {
    let steps = extractSteps(inputFrontEndRules);
}

export function exportUIComponents(steps) {
    let stepUI = []

    stepUI = steps.map((step, index) => {
        return {
            "index": index,
            "ui": getStepUI(step),
            "elementCount": countElements(step) // Add element count
        }
    })

    return stepUI;
}

export function validateConditions(conditions = [], context = new Map()) {
    if (!Array.isArray(conditions)) {
        console.error("Conditions is not an array:", conditions);
        return false; // Oder true, je nach gewünschtem Verhalten
    }

    return conditions.every(condition => {
        const {logicType, value, conditionValue} = condition;
        return evalLogic(logicType, value, conditionValue, context)
    });
}

function evalLogic(logicType, value, conditionValue, context) {
    let returnValue = false;
    let invert = false;
    if(logicType.startsWith("!")) {
        invert = true;
    }
    switch (logicType.replace("!", "")) {
        case "group_greaterOrEqual":
            let counterGOE = 0;
            context.forEach((cValue, key, map) => {
                if (!cValue.groups) {
                    return;
                }
                if (cValue.groups.includes(value)) {
                    counterGOE++;
                }
            });
            returnValue = counterGOE >= parseInt(conditionValue);
            break;
        case "group_smallerOrEqual":
            let counterSOE = 0;
            context.forEach((cValue, key, map) => {
                if (cValue.groups.has(value)) {
                    counterSOE++;
                }
            });
            returnValue = counterSOE <= parseInt(conditionValue);
            break;
        case "group_contains":
            let seenEntry = false;
            context.forEach((cValue, key, map) => {
                if (cValue.groups.includes(value)) {
                    seenEntry = true;
                }
            });
            returnValue = seenEntry
            break;
        case "contains_group":
            let l = context.get(value)
            if(!l.groups) {
                returnValue = false;
                return;
            }

            let groups = l.groups;
            if(Array.isArray(conditionValue)) {
                returnValue = conditionValue.some(r => groups.includes(r));
            }else{
                returnValue = groups.includes(conditionValue)
            }
            break;
        case "value_equals":
            if (!context.has(value))
                return false;
            if(Array.isArray(conditionValue)) {
                let v = context.get(value).value
                returnValue = conditionValue.some(r => v.includes(r));
                break;
            }
            returnValue = context.get(value).value == conditionValue;
            break;
        case "used_in_step":
            let step = value
            let wasUsed = conditionValue
            if(name)
            context.forEach((cValue, key, map) => {
                if(key.startsWith(step + "_")) {
                    if(cValue.value == wasUsed) {
                        returnValue = true;
                    }
                }
            })
            break;
        default:
            console.warn(`Unsupported logicType: ${logicType}`);
            return false;
    }
    if(invert) {
        returnValue = !returnValue;
    }
    return returnValue
}

function finalCheckConditions(conditions = [], context = new Map(), setMessages, messages, setCanProcced) {
    console.log("------------------------------")
    console.log("Trying to evaluate the final conditions")
    console.log("Conditions: ", conditions);
    console.log("Context: ", context)
    console.log("------------------------------")

    if (!Array.isArray(conditions)) {
        console.error("Conditions is not an array:", conditions);
        return false; // Oder true, je nach gewünschtem Verhalten
    }
    let errorMessages = new Map();
    let procced = true;
    conditions.forEach(condition => {
        const {conditionName, conditionError, conditionBehaviour, conditionLogic} = condition;
        let isTrue = false;
        switch (conditionBehaviour) {
            case "OR":
                let isTrueOR = false;
                conditionLogic.forEach((logic) => {
                    const {logicType, value, conditionValue} = logic
                    if (evalLogic(logicType, value, conditionValue, context)) {
                        isTrueOR = true;
                    }
                })
                isTrue = isTrueOR;
                break;
            case "AND":
                let isTrueAND = true;
                conditionLogic.forEach((logic) => {
                    const {logicType, value, conditionValue} = logic
                    if (!evalLogic(logicType, value, conditionValue, context)) {
                        isTrueAND = false;
                    }
                })
                isTrue = isTrueAND;
                break;
        }

        if (!isTrue) {
            errorMessages.set({"value": conditionError}, "error");
            procced = false;
        }
    })
    setMessages(errorMessages);
    setCanProcced(procced)
    return procced;
}

function stepEntriesInContext(context = new Map(), stepNumber) {
    let entries = 0
    Array.from(context.keys()).forEach((key) => {
        if (key.startsWith(stepNumber + "_")) {
            entries++;
        }
    })
    return entries;
}

import {useState, useEffect} from "react";
import ButtonPrimary from "@/components/ButtonPrimary";

export function StepUI({step, number = -1, initialContext = {}, setContext, setMessages, messages, setCanProcced}) {
    const {StepName, StepValues} = step;

    const [localContext, setLocalContext] = useState(initialContext);
    const [stepValuesUI, setStepValuesUI] = useState();

    useEffect(() => {
        updateUI()
    }, [step]);


    const reprocessValues = (values, stepName) => {
        const newValues = [];
        values.map((value, valueIndex) => {
            value.index = valueIndex+1
            const isValueDisabled = validateConditions(value.conditions || [], localContext);
            const isValueUnique = validateUnique(value.unique, localContext, value, number, stepName, valueIndex+1)
            if(value.dontHide) {
                newValues.push({
                    ...value,
                    disabled: !isValueDisabled || !isValueUnique,
                });
                return;
            }
            if(!isValueDisabled) {
                return;
            }
            newValues.push( {
                ...value,
                disabled: !isValueUnique,
            });
        });
        return newValues;
    };

    const handleSelectionChange = (selectedValue, name) => {
        const newMap = localContext;
        newMap.delete(number + "_" + name)
        newMap.set(number + "_" + name, selectedValue)
        setLocalContext(newMap);
        setContext(newMap);
        updateUI()
        let filledOut = stepEntriesInContext(localContext, number)
        if (filledOut === StepValues.length) {
            finalCheckConditions(step.Conditions, localContext, setMessages, messages, setCanProcced)
        }
    };

    const updateUI = () => {
        setStepValuesUI(StepValues.map((stepValue, index) => {
            const {name, type, values, standardvalue} = stepValue;

            const processedValues = reprocessValues(values, name);
            switch (type) {
                case "dropdown":
                    return (
                        <SelectRoster
                            key={`${name}_${index}`}
                            items={processedValues}
                            context={localContext}
                            standardvalue={standardvalue}
                            onSelectionChange={(selectedValue) => handleSelectionChange(selectedValue, name)}
                            placeholderText={name}
                        />
                    );

                case "select":
                    return (
                        <SelectableRoster
                            key={`${name}_${index}`}
                            items={processedValues}
                            standardvalue={standardvalue}
                            context={localContext}
                            onSelectionChange={(selectedValue) => handleSelectionChange(selectedValue, name)}
                        />
                    );

                default:
                    return <h1 key={index} className="text-red-700">Unknown type: {type}</h1>;
            }
        }))
    };

    useEffect(() => {
        updateUI()
    }, []);


    return (
        <div>
            <h1 className="text-xl mb-4">
                {number >= 0 ? `${number + 1}. ` : ""}
                {StepName}
            </h1>
            {stepValuesUI}
            <div className={"mt-4"}></div>
        </div>
    );
}


function validateUnique(unique = "*", context = new Map(), inValue = {
    "value": "",
    "displayText": "",
    "unique": "none",
    "groups": [],
    "conditions": []
}, stepNumber = -1, name = "") {
    if (unique == "" || unique === "none") {
        return true
    }
    let returnValue = true;
    let split = unique.split("-")
    switch (split[0]) {
        case "*":
            context.forEach((value, key, map) => {
                if(key == (stepNumber + "_" + name) && value.index == inValue.index) {
                    return;
                }
                if (value.value == inValue.value) {
                    returnValue = false;
                }
            })
            return returnValue;
        case "step":
            context.forEach((value, key, map) => {
                if(key == (stepNumber + "_" + name) && value.index == inValue.index) {
                    return;
                }
                if (inValue.value == value.value && key.startsWith(stepNumber + "_")) {
                    returnValue = false;
                }
            })
            return returnValue; // Beispiel für Schritt-Validierung
        case "groupName":
            let res = true;
            context.forEach((value, key, map) => {
                let groupToTest = split[1]
                if(!value.groups) {
                    return;
                }
                if (value.groups.includes(groupToTest)) {
                    if (!((key == (stepNumber + "_" + name) && value.value === inValue.value))) {
                        res = false;
                    }
                }
            })
            returnValue = res;
            return returnValue
    }
    return returnValue
}

export function countElementsInStep(steps, stepNumber = 0) {
    if (steps && steps[stepNumber]) {
        const step = steps[stepNumber];
        let valueCount = 0;

        // Sicherstellen, dass StepValues ein Array ist
        const stepValues = Array.isArray(step.StepValues) ? step.StepValues : [];

        // Iteriere über jedes StepValue und zähle die 'values'
        stepValues.forEach((stepValue) => {
            if (stepValue.values) {
                valueCount += stepValue.values.length; // Zählt die Elemente in 'values'
            }
        });

        console.log("Counting elements in step:", stepNumber, "-> Total 'values' count:", valueCount);
        return valueCount;
    }
    return 0;
}