"use client";
import { useState, useEffect } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";

function Dashboard() {
    const [debugLogs, setDebugLogs] = useState(["Debug logs will appear here..."]);
    const [statusText, setStatusText] = useState("Deine Kurswahl wird momentan überprüft");
    const [progression, setProgression] = useState(60); // 60% for width calculation
    const [user, setUser] = useState({ fullname: "Max Mustermann" });

    const addDebugLog = (message) => {
        setDebugLogs((prevLogs) => [...prevLogs, message]);
    };

    useEffect(() => {
        // onMount equivalent
        console.log("Component mounted");
        addDebugLog("Component mounted");
    }, []);

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <header className="mb-8 text-center">
                <img
                    className="mx-auto"
                    alt="Nutzerprofilbild!"
                    src="/static/media/placeholder/profilepicture.svg"
                />
                <div className="text-4xl font-bold text-black mb-2 mt-2">
                    Hallo, <h1 className="text-blue-600 inline">{user.fullname}!</h1>
                </div>
            </header>

            {/* Main Dashboard */}
            <div className="grid grid-cols-1 gap-6 lg:w-1/2 mx-auto">
                {/* Progression Section */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Fortschritt</h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{ width: `${progression}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-700">{statusText}</p>
                </section>

                <section className="mx-auto">
                    <ButtonPrimary text="Fortsetzen" />
                </section>

                <section className="mx-auto">
                    <Link className="p-3 text-white rounded-md text-center bg-red-500" href={"/userarea/admin/dashboard"} prefetch={true}>
                        Admin-Dashboard
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
