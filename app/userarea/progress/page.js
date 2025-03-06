"use client";
import Step1 from "@/components/steps/step1";
import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect, useState} from "react";
import {StepUI} from "@/utils/RulesEngine";
import Link from "next/link";
import ButtonPrimary from "@/components/ButtonPrimary";
import HoursPreview from "@/components/HoursPreview";
import FinalView from "@/components/FinalView";
import ContextViewer from "@/components/vis/ContextViewer";
import SaveDialog from "@/components/SaveDialog";
import {NextResponse as res} from "next/server";

export default function Progress() {
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const initialStepNumber = parseInt(searchParams.get("step")) || 0; // Default to 0 if step is null
    const [stepNumber, setStepNumber] = useState(-1); // Step number state
    const debugMode = true;
    const [currentStepData, setCurrentStepData] = useState({});
    const [context, setContext] = useState(new Map()); // State to hold the JSON data
    const [loading, setLoading] = useState(true);  // Loading state
    const [saveId, setSaveId] = useState(null);
    const [canProcced, setCanProcced] = useState(false);
    const [stepData, setStepData] = useState({});
    const [changesSinceSave, setChangesSinceSave] = useState(false);
    const [messages, setMessages] = useState(new Map([]
    ));

    const [hours, setHours] = useState([]);
    const [saveDialogTriggeredExternally, setSaveDialogTriggeredExternally] = useState(new Map([]
    ));

    useEffect(() => {

        async function initializeGivenContext() {
            let loadedContext = new Map()
            let conTxt = [];
            if(!searchParams.has("contextText")) {
               return false;
            }
            try {
                conTxt = JSON.parse(searchParams.get("contextText"))
            }catch (error) {

            }

            let lastEl = "";
            for (const key in conTxt) {
                lastEl = key;
                loadedContext.set(key, conTxt[key]);
            }
            const extractedStepNumber = parseInt(lastEl.split("_")[0])
            setContext(loadedContext);
            setStepNumber(extractedStepNumber);
        }
        initializeGivenContext();

        function initializeSaveID() {
            if(searchParams.has("id")) {
                setSaveId(parseInt(searchParams.get("id")));
            }
        }
        initializeSaveID();

        // Fetch JSON data from the web file
        async function fetchStepData() {
            try {
                const response = await fetch('/crs/sample.json'); // Replace with your JSON URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStepData(data); // Set the fetched data
            } catch (error) {
                console.error("Error fetching JSON:", error);
            } finally {
                setLoading(false); // Update loading state
            }
        }

        fetchStepData()

    }, []);

    useEffect(() => {
        if (!stepData || !stepData.Steps) {
            return
        }
        setCurrentStepData(stepData.Steps[stepNumber])

        if(stepNumber+1 > stepData.Steps.length) {
            if(saveId) {
                updateSave(saveId, context, setChangesSinceSave())
            }
        }
    }, [stepNumber, stepData]);

    function renderNotifications() {
        let notifications = [];
        messages.forEach((value, key) => {
            switch (value.toLowerCase()) {
                case "info":
                    notifications.push(
                        <div key={value + "_" + key.value + "-" + key.name}
                             className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                             role="alert">
                            <span className="font-bold">{key.name !== "" ? key.name : "Info. "}</span> {key.value}
                        </div>
                    );
                    break;
                case "error":
                    notifications.push(
                        <div key={value + "_" + key.value + "-" + key.name}
                             className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                             role="alert">
                            <span className="font-bold">{key.name !== "" ? key.name : "Achtung! "}</span> {key.value}
                        </div>
                    )
                    break;
                case "success":
                    notifications.push(
                        <div key={value + "_" + key.value + "-" + key.name}
                             className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                             role="alert">
                            <span className="font-bold">{key.name != "" ? key.name : "Erfolg! "}</span> {key.value}
                        </div>
                    )
                    break;
                case "warning":
                    notifications.push(
                        <div key={value + "_" + key.value + "-" + key.name}
                             className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                             role="alert">
                            <span className="font-bold">{key.name != "" ? key.name : "Warnung! "}</span> {key.value}
                        </div>
                    )
                    break;
                case "info2":
                    notifications.push(
                        <div key={value + "_" + key.value + "-" + key.name}
                             className="p-4 text-sm text-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                             role="alert">
                            <span className="font-bold">{key.name != "" ? key.name : "Info. "}</span> {key.value}
                        </div>
                    )
            }
        })
        return notifications;
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">

                <div role="status">
                    <svg aria-hidden="true"
                         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>

            </div>
        );
    }



    return (
        <>
            <SaveDialog setDialogTriggered={setSaveDialogTriggeredExternally} dialogTriggered={saveDialogTriggeredExternally} saveID={saveId} onSave={(name)=>{updateSave(saveId, context, setChangesSinceSave)}} onSaveAs={(name)=>{saveProgressAs(name, context, setSaveId, setChangesSinceSave)}}></SaveDialog>
            <div className={"absolute z-50"}>
                <div className="w-screen flex items-center justify-center ">
                    <div className={"block mt-24"}>
                        {renderNotifications()}
                    </div>
                </div>
            </div>
            {debugMode == true ? <ContextViewer context={context} hours={hours} /> : ""}
            <div className="grid place-items-center h-screen">
                <div className="bg-white min-w-96 p-4 rounded-md">
                    {stepData && stepData.Steps != null && stepData.Steps.length > 0 && stepNumber >= 0 && currentStepData ?
                        ((stepNumber+1 > stepData.Steps.length) ? <FinalView hours={hours} categorysort={stepData.CategorySort} lines={stepData.FileLayout}></FinalView> :
                            <div>
                                <StepUI step={currentStepData} number={stepNumber} initialContext={context}
                                    setContext={setContext} setMessages={setMessages} messages={messages}
                                    setCanProcced={setCanProcced} allSteps={stepData.Steps} subjectConfig={stepData.SubjectConfig} hours={hours} setHours={setHours} changesSinceSave={changesSinceSave} setChangesSinceSave={setChangesSinceSave} saveMethod={() => {saveProgressAuto(setChangesSinceSave, setSaveDialogTriggeredExternally, saveId, context)}}></StepUI>
                                <ButtonPrimary isActive={canProcced} text={"Weiter"} callback={() => {
                                    setStepNumber(stepNumber + 1)
                                    setCanProcced(false)
                                }}></ButtonPrimary>
                            </div>
                                )
                        : <h1>
                            <div role="status"
                                 className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                                <div className={"w-full"}>
                                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl dark:bg-gray-700 w-full mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl dark:bg-gray-700 w-full mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl dark:bg-gray-700 w-full mb-4"></div>
                                </div>
                            </div>
                        </h1>
                    }

                </div>
            </div>
        </>
    );
}

async function saveProgressAs(name, context, setId, setChangesSinceSave) {
    const re = await fetch("/api/progress/saved/new", {
            method: "POST",
            body: JSON.stringify(
                {
                    name: name,
                    context: Object.fromEntries(context)
                }
            ),
     })
    const json = await re.json();
    setId(json.save.id)
    setChangesSinceSave(false)
}

const updateSave = async (id, context, setChangesSinceSave) => {
    if(!id) return;
    console.log(context)
    const re = await fetch("/api/progress/saved/update", {
        method: "POST",
        body: JSON.stringify(
            {
                id: id,
                context: Object.fromEntries(context)
            }
        ),
    })
    const json = await re.json();
    setChangesSinceSave(false)
}
const saveProgressAuto = async (setChangesSinceSave, setSaveDialogTriggered, id, context) => {
    if(id) {
        await updateSave(id, context, setChangesSinceSave)
        return;
    }
    setSaveDialogTriggered(true)
}

