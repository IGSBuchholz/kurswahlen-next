"use client";
import Sidebar from "@/components/Sidebar";
import { countElementsInStep, StepUI } from "@/app/userarea/admin/StepUI-Admin/StepUI-Admin";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ConfigDashboard() {
    const [context, setContext] = useState(new Map());
    const [dataBeingEdited, setDataBeingEdited] = useState({ Steps: [] });
    const [elementCount, setElementCount] = useState(0);
    const stepRefs = useRef([]);
    const [isDeleteStepActive, setIsDeleteStepActive] = useState(false);
    const [updatedValuesWithIds, setUpdatedValuesWithIds] = useState([]); // Zustand für aktualisierte Werte mit IDs
    const [showStep1, setShowStep1] = useState(true);
    const [activeStepIdEdit, setActiveStepIdEdit] = useState(null);
    const [editedName, setEditedName] = useState(""); // Temporärer Name

    useEffect(() => {
        //localStorage.clear(); // Uncomment this line to clear localStorage
        const storedData = localStorage.getItem("stepsData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setDataBeingEdited(parsedData);
            setElementCount(countElementsInStep(parsedData.Steps));
            setUpdatedValuesWithIds(assignIdsToUpdatedValues(parsedData.Steps[0]?.StepValues[0]?.values || []));
        } else {
            fetchStepData();
        }
    }, []);

    const assignIdsToUpdatedValues = (updatedValues) => {
        return updatedValues.map((value, index) => {
            return { ...value, id: index }; // Füge die ID hinzu, basierend auf dem Index
        });
    };

    const fetchStepData = async () => {
        try {
            const response = await fetch('/crs/sample.json'); // Ersetze dies mit deiner URL
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data); // Debugging: Log the fetched data
            setDataBeingEdited(data); // Setze die abgerufenen Daten
            setElementCount(countElementsInStep(data.Steps)); // Set the count of elements in step 0
            // Speichere die abgerufenen Daten in localStorage
            localStorage.setItem("stepsData", JSON.stringify(data));
        } catch (error) {
            console.error("Fehler beim Abrufen der JSON-Daten:", error);
        }
    };

    // Berechnung der Position des Plus-Buttons
    const getPositionForPlusButton = () => {
        const steps = stepRefs.current; // Alle Schritte (Step 0 und nachfolgende)

        if (dataBeingEdited.Steps && dataBeingEdited.Steps.length === 0) {
            // Wenn keine Schwerpunkte existieren, setze die Position an den Anfang
            return {
                top: 80, // Zum Beispiel 80px unter dem Titelbereich
                left: "50%",
                transform: "translateX(-50%)",
            };
        } else if (steps.length > 0) {
            // Berechne die Höhe des letzten hinzugefügten Schritts
            const lastStepRef = steps[steps.length - 1]; // Das letzte Element in steps
            const lastStepHeight = lastStepRef.offsetHeight;

            // Falls der Minus-Button aktiv war, setze die Höhe entsprechend
            const adjustedTop = isDeleteStepActive
                ? lastStepRef.offsetTop + lastStepHeight - 40  // Minus-Button gedrückt
                : lastStepRef.offsetTop + lastStepHeight + 80; // Standardhöhe beim Plus-Button



            // Berechne die Position direkt unter dem letzten Schritt
            return {
                top: adjustedTop,
                left: "50%",
                transform: "translateX(-50%)",
            };
        }

        // Standardposition, falls keine Steps vorhanden sind
        return { top: "5%", left: "90%", transform: "translateX(-50%)" };
    };


    // Berechnung der Position für den Minus-Button
    const getPositionForMinusButton = (index) => {
        const stepRef = stepRefs.current[index]; // Ref für das aktuelle StepUI-Element
        if (stepRef) {
            const stepHeight = stepRef.offsetHeight;
            return {
                top: stepHeight + 20, // 20px unter dem aktuellen Schritt
                left: "50%",
                transform: "translateX(-50%)",
            };
        }
        return { top: "20%", left: "50%", transform: "translateX(-50%)" }; // Standardposition
    };

    const getPositionForEditButton = (index) => {
        const stepRef = stepRefs.current[index]; // Ref für das aktuelle StepUI-Element
        if (stepRef) {
            const stepHeight = stepRef.offsetHeight;
            return {
                top: stepHeight + 20, // 20px unter dem aktuellen Schritt
                left: "50%",
                transform: "translateX(-50%)",
            };
        }
        return { top: "20%", left: "50%", transform: "translateX(-50%)" }; // Standardposition
    };    

    const handleAddStep = () => {
        const step = dataBeingEdited.Steps[0]; // Schritt 0
    
        // Sicherstellen, dass `StepValues` und `values` korrekt initialisiert sind
        const stepValues = Array.isArray(step.StepValues) ? step.StepValues : [];
        const values = stepValues[0]?.values ? stepValues[0].values : []; // Zugriff auf values innerhalb von StepValues
    
        // Neues Element mit Namen und Wert erstellen
        const newValue = {
            displayText: `Schwerpunkt ${values.length + 1}`, // Der angezeigte Name des neuen Schwerpunkts
            value: `Value_${Date.now()}`, // Der Wert des Schwerpunkts, z.B. "Value_1"
        };
    
        // Füge das neue Element zu `values` hinzu
        const updatedValues = [...values, newValue];
    
        // IDs zu den bestehenden Werten zuweisen (diesmal direkt nach dem Hinzufügen)
        const updatedValuesWithIds = assignIdsToUpdatedValues(updatedValues);

        // IDs erneut verteilen, falls notwendig (Anpassung wie bei dem Beispielbefehl)
        setUpdatedValuesWithIds(assignIdsToUpdatedValues(updatedValuesWithIds));
    
        // Aktualisiere StepValues mit den neuen `values`
        const updatedStepValues = stepValues.map((stepValue, index) => {
            if (index === 0) {
                return { ...stepValue, values: updatedValuesWithIds }; // Setze die neuen values für Step 0
            }
            return stepValue;
        });
    
        // Aktualisiere die Steps mit den neuen StepValues
        const updatedSteps = dataBeingEdited.Steps.map((step, index) => {
            if (index === 0) {
                return { ...step, StepValues: updatedStepValues }; // Update StepValues in Step 0
            }
            return step;
        });
        

        // State aktualisieren
        setDataBeingEdited((prev) => ({ ...prev, Steps: updatedSteps }));
        setElementCount(countElementsInStep(updatedSteps)); // Update der Anzahl der Elemente
    
        // Hier setzen wir einen Zustand, um zu markieren, dass ein Schritt gelöscht wurde
        setIsDeleteStepActive(false); // Indiziert, dass ein Schritt hinzugefügt wurde
        getPositionForPlusButton(); // Aktualisiere die Position des Plus-Buttons
    
        // Speichere die Änderungen in localStorage
        localStorage.setItem("stepsData", JSON.stringify({ ...dataBeingEdited, Steps: updatedSteps }));
    };

    const handleDeleteStep = (stepIndex, id) => {
        // Zugriff auf den entsprechenden Schritt
        const step = dataBeingEdited.Steps[stepIndex]; // Hole den spezifischen Schritt basierend auf dem Index
    
        // Zugriff auf die StepValues des Schrittes
        const stepValues = Array.isArray(step.StepValues) ? step.StepValues : [];
    
        // Sicherstellen, dass StepValues und die Werte korrekt initialisiert sind
        const values = stepValues[0]?.values ? stepValues[0].values : [];
    
        // Überprüfen, ob es Werte gibt
        if (values.length > 0) {
            // Entferne das Element mit der übergebenen ID aus dem values-Array
            const updatedValues = values.filter((value) => value.id !== id);
    
            // IDs zu den bestehenden Werten zuweisen (falls notwendig)
            const updatedValuesWithIds = assignIdsToUpdatedValues(updatedValues);
    
            // StepValues mit den aktualisierten Werten versehen
            const updatedStepValues = stepValues.map((stepValue, index) => {
                if (index === 0) {
                    return { ...stepValue, values: updatedValuesWithIds }; // Setze die neuen values für Step 0
                }
                return stepValue;
            });
    
            // Die Steps mit den neuen StepValues updaten
            const updatedSteps = dataBeingEdited.Steps.map((step, index) => {
                if (index === stepIndex) {
                    return { ...step, StepValues: updatedStepValues }; // Update StepValues für den Schritt
                }
                return step;
            });
    
            // Den State mit den neuen Steps updaten
            setDataBeingEdited((prev) => ({ ...prev, Steps: updatedSteps }));
            setElementCount(countElementsInStep(updatedSteps)); // Update der Anzahl der Elemente
    
            // Hier setzen wir einen Zustand, um zu markieren, dass ein Schritt gelöscht wurde
            setIsDeleteStepActive(true); // Indiziert, dass ein Schritt gelöscht wurde
            getPositionForPlusButton(); // Aktualisiere die Position des Plus-Buttons
    
            // Speichere die Änderungen in localStorage
            localStorage.setItem("stepsData", JSON.stringify({ ...dataBeingEdited, Steps: updatedSteps }));
        }
    };


    const handleEditStep = (id) => {
        if (activeStepIdEdit === id) {
            setActiveStepIdEdit(null); // Schließen, falls bereits aktiv
            setShowStep1(true);
        } else {
            setActiveStepIdEdit(id); // Öffnen für diesen Schwerpunkt
            setShowStep1(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Tool-Anpassung</h1>
                </header>

                {/* Editing Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 relative">
                        <h2 className="text-xl font-bold underline text-blue-600">Schwerpunkte</h2>

                        {/* Rendern von Step 0 */}
                        {dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[0] ? (
                            <div ref={(el) => stepRefs.current[0] = el}>
                                <StepUI 
                                    context={context} 
                                    setContext={setContext} 
                                    initialContext={context} 
                                    setMessages={() => {}} 
                                    setCanProcced={() => {}} 
                                    step={dataBeingEdited.Steps[0]} 
                                    number={0} 
                                    setLoading={() => {}} 
                                />
                            </div>
                        ) : ""}

                        {/* Display the count of elements in step 0 */}
                        <div className="pt-20">
                            <p className="text-sm text-gray-600">Anzahl der Elemente in Schritt 0: {elementCount}</p>
                        </div>
                        <div className="pt-20">
                            <p className="text-sm text-gray-600">Anzahl der Schwerpunkte: {updatedValuesWithIds.length}</p>
                            <div>
                                <h2 className="text-lg font-semibold">Schwerpunkte mit IDs:</h2>
                                <ul>
                                    {updatedValuesWithIds.map((value) => (
                                        <li key={value.id} className="text-sm text-gray-700">
                                            {value.displayText} (ID: {value.id})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Dynamisch positionierter Plus-Button nur für Step 0 */}
                        {dataBeingEdited.Steps && dataBeingEdited.Steps.length > 0 && (
                            <div
                                className="absolute"
                                style={getPositionForPlusButton()}
                            >
                                <button
                                    className="bg-blue-400 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center"
                                    onClick={handleAddStep} // Funktion zum Hinzufügen eines Schwerpunkts
                                >
                                    +
                                </button>
                            </div>
                        )}

                        {/* Fünf Minus-Buttons für Step 0 */}
                        {dataBeingEdited.Steps[0]?.StepValues[0]?.values?.map((value, index) => {
                            const positionTop = 102 + index * 56; // Position für jeden Button anpassen
                            return (
                                <div
                                    key={value.id} // Verwende die ID des Schwerpunkts als Key
                                    className="absolute"
                                    style={{ top: `${positionTop}px`, left: "90%", transform: "translateX(-50%)" }}
                                >
                                    <button
                                        className="bg-red-600 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center"
                                        onClick={() => handleDeleteStep(0, value.id)} // Übergabe des Schritts und der ID des Schwerpunkts
                                    >
                                        -
                                    </button>
                                </div>
                            );
                        })}

                        {dataBeingEdited.Steps[0]?.StepValues[0]?.values?.map((value, index) => {
                            const positionTop = 102 + index * 56; // Position für jeden Button anpassen
                            return (
                            <div
                                key={value.id} // Verwende die ID des Schwerpunkts als Key
                                className="absolute"
                                style={{ top: `${positionTop}px`, left: "80%", transform: "translateX(-50%)" }}
                            >
                                {/* Fokus auf den Namen setzen, wenn dieser aktiv bearbeitet wird */}
                                <span
                                onClick={() => handleEditStep(value.id)} // Toggle Edit-Status beim Klicken
                                className={activeStepIdEdit === value.id ? "text-red-500 cursor-pointer" : "cursor-pointer"}
                                >
                                {value.displayText}
                                </span>

                                {/* Edit-Button */}
                                <button
                                className="bg-yellow-400 text-black font-bold rounded-full w-7 h-7 flex items-center justify-center"
                                onClick={() => handleEditStep(value.id)} // Toggle Edit-Status beim Klicken
                                >
                                ✎
                                </button>
                            </div>
                            );
                        })}
                    </div>

                    {/* Weitere Sektionen für Bearbeitung */}
                    {/* Nur Step 1 und Step 2 werden hier angezeigt, ohne den Plus-Button */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold underline text-blue-600">Prüfungsfächer-Bearbeitung</h2>
                        {showStep1 && dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[1] ? (
                            <StepUI 
                                context={context} 
                                setContext={setContext} 
                                initialContext={context} 
                                setMessages={() => {}} 
                                setCanProcced={() => {}} 
                                step={dataBeingEdited.Steps[1]} 
                                number={1} 
                                setLoading={() => {}} 
                            />
                        ) : ""}
                        {!showStep1 && dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[1] ? (
                            <div className="pt-20">
                                <p className="text-sm text-gray-600">...___Individuelle Bearbeitung___...</p>
                            </div>
                        ) : ""}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold underline text-blue-600">Belegungsfächer-Bearbeitung</h2>
                        {dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[2] ? (
                            <StepUI 
                                context={context} 
                                setContext={setContext} 
                                initialContext={context} 
                                setMessages={() => {}} 
                                setCanProcced={() => {}} 
                                step={dataBeingEdited.Steps[2]} 
                                number={2} 
                                setLoading={() => {}} 
                            />
                        ) : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}