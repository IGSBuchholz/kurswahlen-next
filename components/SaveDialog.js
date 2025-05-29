"use client";

import { useState, useEffect, useRef } from "react";
import ButtonPrimary from "@/components/ButtonPrimary"; // Using your custom button

export default function SaveDialog({onSave, onSaveAs, saveID, dialogTriggered, setDialogTriggered}) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [tempName, setTempName] = useState("");

    useEffect(() => {
        if(dialogTriggered == true) {
            setTempName("");
            setIsOpen(true);
            setDialogTriggered(false);
        }
    }, [dialogTriggered]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

            if (cmdOrCtrl && event.key.toLowerCase() === "s") {
                event.preventDefault();
                if (event.shiftKey) {
                    // Cmd + Shift + S → Open "Save As" dialog
                    setTempName("");
                    setIsOpen(true);
                } else {
                    // Cmd + S → Save if a name exists
                    if (saveID != null) {
                        onSave(name);
                    } else {
                        setIsOpen(true); // Open dialog if no name exists
                    }
                }
            }

            if (event.key === "Escape") {
                setIsOpen(false);
            }

        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [name, onSave, isOpen]);

    useEffect(() => {
        if(isOpen) {
            const focus = document.querySelector(
                `input[name=focusline]`
            )
            if(!focus) {
                console.error("Focus not found")
            }
            focus.focus();
        }
    }, [isOpen]);

    const handleSubmit = () => {
        const finalName = tempName.trim();
        if (finalName) {
            setName(finalName);
            onSaveAs(finalName);
            setIsOpen(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white shadow-lg rounded-lg p-4 w-[400px]">
                        <h2 className="text-lg font-semibold mb-2">Speichern</h2>
                        <input
                            value={tempName}
                            name={"focusline"}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Name..."
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                Abbrechen
                            </button>
                            <ButtonPrimary callback={handleSubmit} disabled={!tempName.trim()} text={"Speichern"}>
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L13 13M3 13L13 3" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

