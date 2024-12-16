"use client";
import Step1 from "@/components/steps/step1";
import { useSearchParams } from 'next/navigation'
import Step2 from "@/components/steps/step2";
import {useEffect} from "react";
import {evaluateRules, getStepUI, setupEngine} from "@/utils/RulesEngine";

export default function Progress(){


    const searchParams = useSearchParams()
    const stepNumber = searchParams.get("step")
    console.log(stepNumber)
    return <>
        <div className="h-screen flex items-center justify-center drop-shadow-xl ">
            <div className="bg-white w-96 p-4 rounded-md">
                {stepNumber == 1 ? getStepUI({
                    "StepName": "Choose Focus",
                    "StepValues": [
                        {
                                "name": "Focus",
                                "type": "select",
                                "values": [
                                    {"value": "sprachlich", "displayText": "Sprachlich"},
                                    {"value": "künstlerisch", "displayText": "Künstlerisch-Musisch"},
                                    {
                                        "value": "gesellschaftswissenschaftlich",
                                        "displayText": "Gesellschaftswissenschaftlich"
                                    },
                                    {"value": "mathematisch", "displayText": "Mathematisch-Naturwissenschaftlich"},
                                    {"value": "sport", "displayText": "Sport"}
                                ]
                        }
                    ]
                }) : (stepNumber == 2) ? getStepUI({
                    "StepName": "Select Prüfungsfächer (P1-P5)",
                    "StepValues": [
                        {
                            "name": "P1",
                            "type": "dropdown",
                            "values": [
                                { "value": "Deutsch", "displayText": "Deutsch", "conditions": { "Focus": "sprachlich" } },
                                { "value": "Englisch", "displayText": "Englisch", "conditions": { "Focus": ["sprachlich", "künstlerisch"] } },
                                { "value": "Mathematik", "displayText": "Mathematik", "conditions": { "Focus": ["mathematisch", "sport"] } }
                            ]
                        },
                        {
                            "name": "P2",
                            "type": "dropdown",
                            "values": [
                                { "value": "Kunst", "displayText": "Kunst", "conditions": { "Focus": "künstlerisch" } },
                                { "value": "Geschichte", "displayText": "Geschichte", "conditions": { "Focus": "gesellschaftswissenschaftlich" } }
                            ]
                        },
                        {
                            "name": "P3",
                            "type": "dropdown",
                            "values": [
                                { "value": "Physik", "displayText": "Physik", "conditions": { "Focus": "mathematisch" } },
                                { "value": "Politik-Wirtschaft", "displayText": "Politik-Wirtschaft", "conditions": {} },
                                { "value": "Sport", "displayText": "Sport", "conditions": { "Focus": "sport" } }
                            ]
                        }
                    ]
                }) : ""}
            </div>
        </div>
    </>

}