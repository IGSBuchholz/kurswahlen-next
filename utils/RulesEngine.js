import SelectableRoster from "@/components/SelectableRoster";
import SelectRoster from "@/components/SelectRoster";
import Image from "next/image";

export function init(inputFrontEndRules) {
    let steps = extractSteps(inputFrontEndRules);

}

export function exportUIComponents(steps) {
    let stepUI = []

    stepUI = steps.forEach((step, index) => {

        return {
            "index": index,
            "ui": getStepUI(step)
        }

    })

    return stepUI;
}


export function getPlan(context, step) {
    context.forEach((value, key)  => {
    })
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
                }x
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
import HoursPreview from "@/components/HoursPreview";

export function StepUI({step, number = -1, initialContext = {}, setContext, setMessages, messages, setCanProcced, allSteps, hours, setHours, subjectConfig, saveMethod, setChangesSinceSave, changesSinceSave}) {
    const {StepName, StepValues} = step;
    const [localContext, setLocalContext] = useState(initialContext);
    const [stepValuesUI, setStepValuesUI] = useState();
    let hashSubjectConfig = new Map();

    useEffect(() => {
        updateUI()
        console.log("Step", step)
    }, [step]);


    useEffect(() => {
        subjectConfig.forEach((config) => {
            hashSubjectConfig.set(config.value, config)
        })
    },[subjectConfig]);

    const  reprocessValues = (values, stepName) => {
        const newValues = [];
        values.map((value, valueIndex) => {
            value.index = valueIndex+1
            const isValueDisabled = validateConditions(value.conditions || [], localContext);
            const isValueUnique = validateUnique(value.unique, localContext, value, number, stepName, valueIndex+1)
            if(hashSubjectConfig.has(value.value)) {
                let overrideValues = hashSubjectConfig.get(value.value);
                if(overrideValues.groups) {
                    value.groups = value.groups.concat(overrideValues.groups);
                }
                value.displayPosition = overrideValues.displayPosition;
            }
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
        console.log("changes")
        setChangesSinceSave(true)

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
        setHours(generateHours(localContext, allSteps))
        console.log("Step:",step)
        if(!StepValues){
            return;
        }
        setStepValuesUI(StepValues.map((stepValue, index) => {
            const {name, type, values, standardvalue} = stepValue;

            const processedValues = reprocessValues(values, name);

            let initialValue = standardvalue;
            if(localContext.has(number + "_" + name)){
                initialValue = localContext.get(number + "_" + name).value;
            }
            switch (type) {
                case "dropdown":
                    return (
                        <SelectRoster
                            key={`${name}_${index}`}
                            items={processedValues}
                            context={localContext}
                            standardvalue={initialValue}
                            onSelectionChange={(selectedValue) => handleSelectionChange(selectedValue, name)}
                            placeholderText={name}
                        />
                    );

                case "select":
                    return (
                        <SelectableRoster
                            key={`${name}_${index}`}
                            items={processedValues}
                            standardvalue={initialValue}
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
            <div className={"w-full flex justify-between"}>
                <h1 className="text-xl mb-4 inline-block">
                    {number >= 0 ? `${number + 1}. ` : ""}
                    {StepName}
                </h1>
                <div className={"p-1 z-50 "} onClick={() => {if(changesSinceSave) {saveMethod()}}}>
                    <SaveLogo className={"inline-block float-right cursor-pointer"} color={changesSinceSave ? "#202124" : "#c5c7c9"} size={25}></SaveLogo>
                </div>
            </div>

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

export function extractSteps(jsonObj) {
    return jsonObj["Steps"].map(step => {
        return {
            ...step,
            Conditions: step.Conditions || []
        };
    });
}

export function getRegularHours(stepPath, allSteps) {
    let hours = 0;
    let semester = [];
    let step = getStep(stepPath, allSteps)

    return {"hours": step.hours, "semester": step.semester}
}

export function getSpecificHours(stepPath, value, context, allSteps) {
    let {hours, semester} = getRegularHours(stepPath, allSteps)
    const overrides = value.overrides;
    if(!overrides) {
        return {"hours": hours, "semester": semester};
    }
    overrides.forEach(override => {
        let overrideHours = override.hours;
        let overrideSemesters = override.semester;

        let overrideActive = true;
        let overrideConditions = override.conditions;
        if(overrideConditions.length > 0) {
            overrideActive = validateConditions(overrideConditions, context)
        }

        if(overrideActive) {
            hours = overrideHours;
            semester = overrideSemesters;
        }
    })
    return {"hours": hours, "semester": semester};
}


export function getPFachText(stepPath, allSteps) {
    let step = getStep(stepPath, allSteps);
    if(step.pfachText) {
        return step.pfachText
    }
    return ""
}

export function generateHours(context, allSteps) {
    console.log("generateHours", context)
    const subjects = []
    console.log("-------- GENERATE HOURS ---------")
    context.forEach((value, key) => {
        console.log("Key: ", (key));
        console.log("Value: ", value)
        let {hours, semester} = getSpecificHours(key, value, context, allSteps)
        console.log("specificHours", hours, semester)
        let displayPosition = "";
        if (value.displayPosition) {
            displayPosition = value.displayPosition
        }
        let pfachText = getPFachText(key, allSteps)
        if (hours == 0 || !semester) {
            return;
        }
        subjects.push({
            "subject": value.value,
            "displayName": value.displayText,
            "displayPosition": displayPosition,
            "semester": semester,
            "hours": hours,
            "pfachText": pfachText,
        })
    })
    console.log("GeneratedHours", subjects)
    console.log("-------- GENERATE HOURS ---------")
    return subjects
}

export function getStep(stepPath, allSteps) {
    let path = stepPath.split("_");
    let stepNumber = path[0]
    let valueName = path[1]
    if(!allSteps) {
        return {"error": "allSteps are not loaded yet"};
    }
    let values = allSteps[stepNumber].StepValues
    let returnValue;
    values.forEach((value, index) => {
        if(value.name == valueName) {
            returnValue = value
        }
    })
    return returnValue;
}
const SaveLogo = ({color = "#32a852", size=10, clickable}) => {
    return <svg  className={"cursor-pointer"} fill={color} width={size} height={size} viewBox="0 0 448 512">
        <path style={clickable ? {cursor: "pointer"} : {cursor: "not-allowed"}}
              d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/>
    </svg>
}