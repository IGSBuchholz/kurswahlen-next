"use client";
import Sidebar from "@/components/Sidebar";
import { countElementsInStep, StepUI } from "@/app/userarea/admin/StepUI-Admin/StepUI-Admin";
import { useState, useEffect, useRef, useCallback } from "react";
import useErrorLogger from "@/app/userarea/admin/dashboard/errorProjection/useErrorLogger";

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
    const [isRenaming, setIsRenaming] = useState(false); // Indikator für den Umbenennungsstatus
    const [newValueName, setNewValueName] = useState(""); // Neuer Name für den Schwerpunkt
    const [askingInput, setAskingInput] = useState(false); // Indikator für die Eingabeaufforderung
    const [updatedData, setUpdatedData] = useState(null); // Zustand für die angezeigten Daten
    const [exam_subjects, setExam_subjects] = useState(""); // Zustand für Prüfungsfächer
    const [exam_sections, setExam_sections] = useState(""); // Zustand für Prüfungsfächer-Sektionen
    const [newExamSubject, setNewExamSubject] = useState(""); // Neue Eingabe für Prüfungsfach
    const [newExamSection, setNewExamSection] = useState(""); // Neue Eingabe für Prüfungssektion
    const [isAddingExamSubject, setIsAddingExamSubject] = useState(false); // Zustand für Hinzufügen von Prüfungsfach
    const [isAddingExamSection, setIsAddingExamSection] = useState(false); // Zustand für Hinzufügen von Prüfungssektion
    const [errors, setErrors] = useErrorLogger("Kurskonfiguration");
    const [configValidationErrorLogged, setConfigValidationErrorLogged] = useState(false);

    useEffect(() => {
        const isScalar = (val) => typeof val === "string" || typeof val === "number" || typeof val === "boolean" || val === null;

        const hasError =
            (exam_subjects && !isScalar(exam_subjects)) ||
            (exam_sections && !isScalar(exam_sections));

        if (hasError && !configValidationErrorLogged) {
            const error = new Error("Ungültiger Wert für ein <select>-Feld: Erwartet skalaren Wert, aber Array oder Objekt erhalten.");
            const timestamp = new Date().toLocaleString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            const message = {
                context: "Kurskonfiguration",
                message: error.message,
                timestamp,
                persistent: true
            };

            const existing = JSON.parse(localStorage.getItem("errorLog") || "[]");
            localStorage.setItem("errorLog", JSON.stringify([...existing, message]));
            setErrors(prev => [...prev, message]);
            setConfigValidationErrorLogged(true);
        }
    }, [exam_subjects, exam_sections, configValidationErrorLogged, setErrors]);

    useEffect(() => {
        //localStorage.clear(); // Uncomment this line to clear localStorage
        const storedSubjects = JSON.parse(localStorage.getItem("exam_subjects")) || [];
        const storedSections = JSON.parse(localStorage.getItem("exam_sections")) || [];
        setExam_subjects(storedSubjects);
        setExam_sections(storedSections);
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

    // Speichern der Konfiguration auf dem Server
    const handleSave = async () => {
        try {
            const res = await fetch("/api/admin-config/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataBeingEdited),
            });
            const result = await res.json();
            if (!result.success) throw new Error(`[${result.step}] ${result.error}`);
            alert("Konfiguration erfolgreich gespeichert.");
        } catch (err) {
            console.error(err);
            alert("Fehler beim Speichern: " + err.message);
        }
    };

    // Zurücksetzen auf Originalzustand (sample.json)
    const handleReset = async () => {
        try {
            const res = await fetch("/api/admin-config/sample");
            const json = await res.json();
            setDataBeingEdited(json);
            localStorage.setItem("stepsData", JSON.stringify(json));
            alert("Zurückgesetzt auf Originalzustand.");
        } catch (err) {
            console.error(err);
            alert("Fehler beim Zurücksetzen.");
        }
    };

    // Wiederherstellen des letzten gespeicherten Stands
    const handleRestoreLast = async () => {
        try {
            const res = await fetch("/api/admin-config/letzter-stand");
            const json = await res.json();
            setDataBeingEdited(json);
            localStorage.setItem("stepsData", JSON.stringify(json));
            alert("Letzter gespeicherter Stand wiederhergestellt.");
        } catch (err) {
            console.error(err);
            alert("Fehler beim Wiederherstellen des letzten Stands.");
        }
    };

    const fetchStepData = async () => {
        try {
            const response = await fetch("/api/admin-config/aktueller-stand");
            if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched data:", data);
            setDataBeingEdited(data);
            setElementCount(countElementsInStep(data.Steps));
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
            value: `Value_${Date.now()}`, // Der Wert des Schwerpunkts, z.B. "Value_1"
            displayText: `Schwerpunkt ${values.length + 1}`, // Der angezeigte Name des neuen Schwerpunkts
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
            setIsRenaming(false);
        } else {
            setActiveStepIdEdit(id); // Öffnen für diesen Schwerpunkt
            setShowStep1(false);
            setIsRenaming(true);
        }
    };

    const handleRenameChange = (e) => {
        setNewValueName(e.target.value);
      };

    const renamingProcess = () => {
        if (activeStepIdEdit !== null) {
            setDataBeingEdited(prevData => {
                const updatedSteps = prevData.Steps.map((step, index) => {
                    if (index === 0) { 
                        const stepValues = Array.isArray(step.StepValues) ? step.StepValues : [];
                        const values = stepValues[0]?.values ? stepValues[0].values : [];
    
                        // Prüfen, ob der Name oder Wert bereits existiert
                        const alreadyExists = values.some(value => value.displayText === newValueName || value.value === newValueName);
                        if (alreadyExists) {
                            alert("Bereits vorhanden");
                            return step;
                        }
    
                        // ID finden und aktualisieren
                        const valueIndex = values.findIndex(value => value.id === activeStepIdEdit);
                        if (valueIndex !== -1) {
                            const updatedValues = [...values];
                            updatedValues[valueIndex] = {
                                ...updatedValues[valueIndex],
                                displayText: newValueName,
                                value: newValueName
                            };
    
                            // IDs neu zuweisen, um saubere Reihenfolge sicherzustellen
                            const updatedValuesWithIds = assignIdsToUpdatedValues(updatedValues);
    
                            const updatedStepValues = [{ ...stepValues[0], values: updatedValuesWithIds }];
                            return { ...step, StepValues: updatedStepValues };
                        }
                    }
                    return step; 
                });
    
                const updatedData = { ...dataBeingEdited, Steps: updatedSteps };
                
                // **localStorage sofort updaten**
                localStorage.setItem("stepsData", JSON.stringify(updatedData));
    
                return updatedData; // Direkte Aktualisierung von dataBeingEdited
            });
            window.location.reload();
    
            console.log(`✅ Der Name wurde erfolgreich geändert: ${newValueName}`);
        }
    };

    // Funktion zum Hinzufügen eines neuen Prüfungsfachs
    const addExamSubject = () => {
        if (newExamSubject.trim() !== "" && !examSubjects.includes(newExamSubject)) {
            const updatedSubjects = [...examSubjects, newExamSubject];
            setExam_subjects(updatedSubjects);
            localStorage.setItem("exam_subjects", JSON.stringify(updatedSubjects));
        }
        setNewExamSubject("");
        setIsAddingExamSubject(false);
    };

    // Funktion zum Hinzufügen einer neuen Prüfungssektion
    const addExamSection = () => {
        if (newExamSection.trim() !== "" && !examSections.includes(newExamSection)) {
            const updatedSections = [...examSections, newExamSection];
            setExam_sections(updatedSections);
            localStorage.setItem("exam_sections", JSON.stringify(updatedSections));
        }
        setNewExamSection("");
        setIsAddingExamSection(false);
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

                        <div className="pt-20">
                            <p className="text-sm text-gray-600">Inhalt von updatedSteps:</p>
                            <pre className="bg-gray-100 p-2 text-xs text-gray-800 rounded">
                                {JSON.stringify(updatedValuesWithIds)}
                            </pre>
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

                        {isRenaming && activeStepIdEdit !== null && (
                            <div
                                className="absolute"
                                style={{ top: `20px`, left: "70%", transform: "translateX(-50%)" }}
                            >
                                <button
                                className="bg-red-500 text-white p-1 rounded"
                                onClick={() => {
                                    // Umbenennen-Button sichtbar machen
                                    setAskingInput(true); // Toggle visibility of the rename input
                                    setIsRenaming(false); // Toggle the renaming status
                                }}
                                >
                                Umbenennen
                                </button>
                            </div>
                        )}

                        {askingInput && (
                            <div
                                className="absolute"
                                style={{ top: `20px`, left: "70%", transform: "translateX(-50%)" }}
                            >
                                <input
                                    type="text"
                                    value={newValueName}
                                    onChange={handleRenameChange} // Neue Name-Änderung erfassen
                                    className="border p-1 rounded"
                                    placeholder="Name eingeben"
                                />
                                <button
                                    onClick={() => {
                                        renamingProcess(); // Renaming-Prozess durchführen
                                        setAskingInput(false); // Input wieder ausblenden
                                    }}
                                        className="bg-blue-500 text-white p-1 rounded ml-2"
                                        style={{ transform: "translateX(40%)" }}
                                    >
                                        Bestätigen
                                    </button>
                            </div>
                        )}
                    </div>

                    {/* Weitere Sektionen für Bearbeitung */}
                    <div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-bold underline text-blue-600">Prüfungsfächer-Bearbeitung</h2>

    {showStep1 && dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[1] ? (
        <div>
            {/* Dropdown für Auswählbare Fächer (exam_subjects) */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Auswählbare Fächer</label>
                <select
                    value={exam_subjects || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setExam_subjects(value);
                        if (value === "+") {
                            setIsAddingExamSubject(true); // Aktiviert die Eingabe für neues Fach
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Bitte auswählen</option>
                    {/* Zeige "Keine Fächer verfügbar" wenn exam_subjects leer ist */}
                    {exam_subjects === "" && <option value="">Keine Fächer verfügbar</option>}
                    {/* Zeige die Option zum Hinzufügen eines neuen Faches */}
                    <option value="+">Hinzufügen</option>
                </select>

                {/* Eingabefeld für neues Fach, wenn "Hinzufügen" geklickt wird */}
                {isAddingExamSubject && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={newExamSubject}
                            onChange={(e) => setNewExamSubject(e.target.value)}
                            placeholder="Neues Fach eingeben"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={addExamSubject}
                            className="text-white bg-green-500 p-2 rounded-lg mt-2"
                        >
                            ✔ Hinzufügen
                        </button>
                    </div>
                )}
            </div>

            {/* Dropdown für Prüfungsfächer-Sektionen (exam_sections) */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Anzahl der Prüfungsfächer</label>
                <select
                    value={exam_sections || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setExam_sections(value);
                        if (value === "+") {
                            setIsAddingExamSection(true); // Aktiviert die Eingabe für neue Prüfungssektion
                        }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Bitte auswählen</option>
                    {/* Zeige "Keine Prüfungssektionen verfügbar" wenn exam_sections leer ist */}
                    {exam_sections === "" && <option value="">Keine Prüfungssektionen verfügbar</option>}
                    {/* Zeige die Option zum Hinzufügen einer neuen Prüfungssektion */}
                    <option value="+">Hinzufügen</option>
                </select>

                {/* Eingabefeld für neue Prüfungssektion, wenn "Hinzufügen" geklickt wird */}
                {isAddingExamSection && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={newExamSection}
                            onChange={(e) => setNewExamSection(e.target.value)}
                            placeholder="Neue Prüfungssektion eingeben"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={addExamSection}
                            className="text-white bg-green-500 p-2 rounded-lg mt-2"
                        >
                            ✔ Hinzufügen
                        </button>
                    </div>
                )}
            </div>

            {/* Optional: Anzeige der ausgewählten Werte */}
            <div className="mt-4">
                {exam_subjects && (
                    <div className="mb-4">
                        <h4 className="text-md font-semibold">Ausgewähltes Auswählbare Fach:</h4>
                        <p>{exam_subjects}</p>
                    </div>
                )}

                {exam_sections && (
                    <div className="mb-4">
                        <h4 className="text-md font-semibold">Ausgewählte Anzahl der Prüfungsfächer:</h4>
                        <p>{exam_sections}</p>
                    </div>
                )}
            </div>
        </div>
    ) : null}


                        {/* Falls showStep1 false ist */}
                        {!showStep1 && dataBeingEdited && dataBeingEdited.Steps && dataBeingEdited.Steps[1] ? (
                            <div className="pt-20">
                                <h3 className="text-lg font-bold">Prüfungsfächer (Step 1)</h3>
                                {dataBeingEdited.Steps[1]?.StepValues.map((stepValue, index) => (
                                    <div key={index} className="mb-4">
                                        <h4 className="text-md font-semibold">{stepValue.name}</h4>
                                        <ul>
                                            {stepValue.values?.map((subject, i) => (
                                                <li key={i}>{subject.displayText}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
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
                <div className="flex justify-between items-center mt-10">
                {/* Zurücksetzen links */}
                <button
                    onClick={handleReset}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-4 py-2 rounded"
                >
                    🔄 Zurücksetzen
                </button>

                {/* Letzter Stand + Speichern rechts */}
                <div className="flex gap-4">
                    <button
                    onClick={handleRestoreLast}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
                    >
                    Letzter Stand
                    </button>
                    <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                    >
                    ✅ Speichern
                    </button>
                </div>
                </div>


            </div>
        </div>
    );
}