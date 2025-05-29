"use client"
import Sidebar from "@/components/Sidebar";
import {useEffect, useState} from "react";

export default function AdminDashboard() {
    const [accordions, setAccordions] = useState([]);
    const [somethingChanged, setSomethingChanged] = useState(false);
    useEffect(() => {
        async function loadAccordion() {
            const res = await fetch("/api/homepage/accordion", {
                method: "GET",
            });
            let data = await res.json();
            console.log("Data", data);
            setAccordions(data);
        }
        loadAccordion()
    }, []);

    const saveAccordion = async () => {
        const res = await fetch("/api/homepage/accordion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accordions) // Send the array directly
        });
        const status = res.status;
        if(status === 200) {
            setSomethingChanged(false);
        }
    }

    const addEntry = () => {
        setAccordions([...accordions, { id: accordions.length, answer: "", question: "" }]);
        setSomethingChanged(true);
    };

    const updateEntry = (id, field, value) => {
        setAccordions(accordions.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
        setSomethingChanged(true);
    };

    const deleteEntry = (id) => {
        setAccordions(accordions.filter(acc => acc.id !== id));
        setSomethingChanged(true);
    };

    const moveEntry = (index, direction) => {
        const newAccordions = [...accordions];
        const targetIndex = index + direction;

        if (targetIndex >= 0 && targetIndex < newAccordions.length) {
            [newAccordions[index], newAccordions[targetIndex]] = [newAccordions[targetIndex], newAccordions[index]];
            setAccordions(newAccordions);
        }
        setSomethingChanged(true);
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">HomePage-Konfiguration</h1>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Akkordeon</h2>
                        <p className="text-gray-700 mt-2 mb-4">Das Akkordeon auf der Homepage des Kurswahltools.</p>

                        {accordions.map((acc, index) => (
                            <div key={acc.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                <input
                                    type="text"
                                    className="w-full border p-2 mb-2"
                                    placeholder="Frage"
                                    value={acc.question}
                                    onChange={(e) => updateEntry(acc.id, "question", e.target.value)}
                                />
                                <textarea
                                    className="w-full border p-2 mb-2"
                                    placeholder="Antwort"
                                    value={acc.answer}
                                    onChange={(e) => updateEntry(acc.id, "answer", e.target.value)}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-gray-500 text-white px-3 py-1 rounded"
                                        onClick={() => moveEntry(index, -1)}
                                        disabled={index === 0}
                                    >
                                        ↑ Hoch
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-3 py-1 rounded"
                                        onClick={() => moveEntry(index, 1)}
                                        disabled={index === accordions.length - 1}
                                    >
                                        ↓ Runter
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => deleteEntry(acc.id)}
                                    >
                                        Löschen
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={addEntry}
                            >
                                + Neues Akkordeon hinzufügen
                            </button>
                            <button
                                className={"text-white px-4 py-2 rounded " + (somethingChanged ? "bg-green-500" : "bg-green-200")}
                                onClick={saveAccordion}
                                disabled={!somethingChanged}
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}