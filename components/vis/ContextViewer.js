"use client"
import React from "react";
import dynamic from "next/dynamic";

const ReactJson =dynamic(() => import("react-json-view"), {ssr: false}); // Dynamisches Importieren der ReactJson-Komponente

export default function ContextViewer({ context, hours = new Map() }) {
    const contextObject = Object.fromEntries(context); // Map in ein JSON-Objekt umwandeln
    const hoursObject = Object.fromEntries(hours); // Map in ein JSON-Objekt umwandeln

    return (
        <div>
            {/* Arbeitszeiten links */}
            <div className="fixed top-16 left-4 z-50 bg-white border border-gray-300 shadow-md p-4 rounded-md max-w-sm max-h-96 overflow-y-auto">
                <h3 className="font-bold text-lg mb-2">Arbeitszeiten</h3>
                <ReactJson
                    src={hours}
                    theme="ocean" // Farbschema
                    iconStyle="triangle"
                    enableClipboard={true}
                    displayDataTypes={false} // Datentypen ausblenden
                    displayObjectSize={false} // Objektgröße ausblenden
                    name={false} // Keine umschließenden Schlüssel
                />
            </div>

            {/* Kontextdaten rechts */}
            <div className="fixed top-16 right-4 z-50 bg-white border border-gray-300 shadow-md p-4 rounded-md max-w-sm max-h-96 overflow-y-auto">
                <h3 className="font-bold text-lg mb-2">Context-Daten</h3>
                <ReactJson
                    src={contextObject}
                    theme="ocean" // Farbschema
                    iconStyle="triangle"
                    enableClipboard={true}
                    displayDataTypes={false} // Datentypen ausblenden
                    displayObjectSize={false} // Objektgröße ausblenden
                    name={false} // Keine umschließenden Schlüssel
                />
            </div>
        </div>
    );
}