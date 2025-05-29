"use client"

import { useState } from "react";

export default function Muell() {

    const [muellantwort, setMuellAntwort] = useState("")

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Müll</h1>
            <p className="text-lg">Hier wird der Müll angezeigt.</p>
            <h2>{muellantwort}</h2>
            <button onClick={async () => {

                const res = await fetch("/api/rulesengine", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        rule: "Müll",
                        context: {
                            "Müll": {
                                "Müll": true
                            }
                        }
                    })
                });
                const json = await res.json()
                setMuellAntwort(JSON.stringify(json))
                

            }}>Mülldeponie</button>
        </div>
    );
}