import SelectableRoster from "@/components/SelectableRoster";
import SelectRoster from "@/components/SelectRoster";


export function init(inputRules){
    let steps = extractSteps(inputRules);

}

export function exportUIComponents(steps){
    let stepUI = []

    stepUI = steps.forEach((step, index) => {

        return {
            "index": index,
            "ui": getStepUI(step)
        }

    })

    return stepUI;
}

export function getStepUI(step, number = -1){
    console.log("test")
    let stepName = step["StepName"]
    let stepValues = step["StepValues"]
    console.log(stepValues)
    let stepNumber = 0;
    let stepValuesUI = []
    stepValues.forEach((stepValue)  => {
        stepNumber++
        let subStepValues = stepValue["values"]
        let stepType = stepValue["type"]
        switch (stepType) {
            case "dropdown":
                console.log("dropdown")
                stepValuesUI.push(<SelectRoster key={stepName + "_" + stepNumber + "_" + stepValue.name} items={subStepValues} onSelectionChange={() => {console.log("Some value was changed")}} />)
                break;
            case "select":
                console.log("select")
                stepValuesUI.push(<SelectableRoster key={stepName + "_" + stepNumber + "_" + stepValue.name} items={subStepValues} onSelectionChange={() => {console.log("Some value was changed")}} />)
                break;
            default:
                stepValuesUI.push(<h1 className={"text-red-700"}>Error while loading type</h1>);
                break;
        }

    })
    console.log(stepValuesUI)
    return <>
        <h1 className={"text-xl mb-4"}><u>{(number !== -1) > 0 ? stepNumber + ". " : ""}{stepName}</u></h1>
        {stepValuesUI}
    </>
}

export function extractSteps(jsonObj) {
    return jsonObj["Steps"]
}

