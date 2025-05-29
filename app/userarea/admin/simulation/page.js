"use client"
import Sidebar from "@/components/Sidebar";
import { StepUI } from "@/utils/RulesEngine";
import { useState, useEffect } from "react";
import useErrorLogger from "@/app/userarea/admin/dashboard/errorProjection/useErrorLogger";

export default function KurswahlSimulationDashboard() {
    const [context, setContext] = useState(new Map());
    const [dataBeingEdited, setDataBeingEdited] = useState({});
    const [, setErrors] = useErrorLogger("Simulation");

        useEffect(() => {
            // Fetch JSON data from the web file
            async function fetchStepData() {
                try {
                    const response = await fetch('/crs/sample.json'); // Replace with your JSON URL
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setDataBeingEdited(data); // Set the fetched data
                } catch (error) {
                    console.error("Error fetching JSON:", error);
                } finally {
                }
            }
    
            fetchStepData();
        }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Simulation des Kurwahltools</h1>
                </header>

                {/* Editing Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold underline text-blue-600">Prüfungsfächer</h2>
                        <p className="text-gray-700 mt-2">_____________________________________________________</p>
                        {dataBeingEdited && dataBeingEdited.Steps ? <StepUI context={context} setContext={setContext} initialContext={context} setMessages={()=>{}} setCanProcced={()=>{}} step={dataBeingEdited.Steps[0]} number={0} setLoading={() =>{}}></StepUI> : ""}
                    <p className="text-gray-700 mt-2">_____________________________________________________</p>
                        {dataBeingEdited && dataBeingEdited.Steps ? <StepUI context={context} setContext={setContext} initialContext={context} setMessages={()=>{}} setCanProcced={()=>{}} step={dataBeingEdited.Steps[1]} number={1} setLoading={() =>{}}></StepUI> : ""}
                        <p className="text-gray-700 mt-2">_____________________________________________________</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold underline text-blue-600">Belegverpflichtete Fächer</h2>
                        <p className="text-gray-700 mt-2">_____________________________________________________</p>
                        {dataBeingEdited && dataBeingEdited.Steps ? <StepUI context={context} setContext={setContext} initialContext={context} setMessages={()=>{}} setCanProcced={()=>{}} step={dataBeingEdited.Steps[2]} number={2} setLoading={() =>{}}></StepUI> : ""}
                        <p className="text-gray-700 mt-2">_____________________________________________________</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold underline text-blue-600">Stundenplan</h2>
                        <p className="text-gray-700 mt-2">...Hier wird testweise ein tabellenartiger Stundenplan gezeigt...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}