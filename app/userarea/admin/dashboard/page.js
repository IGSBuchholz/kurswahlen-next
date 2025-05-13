"use client";
import Sidebar from "@/components/Sidebar";
import {useEffect, useState} from "react";
import dynamic from 'next/dynamic';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default function AdminDashboard() {
    const [servicesStatus, setServicesStatus] = useState({})

    useEffect(() => {
        console.log("EFFECT")
        async function getStatus() {
            console.log("STAT")
            let res = await fetch("/api/admin/connections/status");
            const json = await res.json();
            console.log("STATUS MESSAGE", json)
            setServicesStatus(json);
        }
        getStatus();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Übersicht</h1>
                </header>
                {servicesStatus ?
                    <div className="w-full">
                        <div className="flex flex-col gap-4">
                            {["redis_status", "postgres_status"].map(service => {
                                const status = servicesStatus[service]?.status;
                                const isConnected = status === "connected";
                                const pingTimeMs = servicesStatus[service]?.pingTimeMs;
                                const serviceData = servicesStatus[service];
                                const isPending = serviceData === undefined;
                                return (
                                    <div key={service} className={`p-4 rounded shadow ${isConnected ? "bg-green-100" : "bg-red-100"}`}>
                                        <h2 className="text-xl capitalize flex justify-between items-center mb-2">
                                            <span className={`font-semibold ${isConnected ? "text-green-800" : "text-red-800"}`}>
                                                {service.replace("_", " ")}
                                            </span>
                                            <span className={`text-sm ${isPending ? "text-yellow-800" : isConnected ? "text-green-800" : "text-red-800"}`}>
                                                {isPending
                                                    ? "🟡 Warten..."
                                                    : isConnected
                                                        ? `🟢 Verbunden (${pingTimeMs} ms)`
                                                        : "🔴 Nicht verbunden"}
                                            </span>
                                        </h2>
                                        {!isConnected && servicesStatus[service]?.error && (
                                            <div className="mt-2">
                                                <ReactJson
                                                    src={servicesStatus[service]}
                                                    name={false}
                                                    collapsed={false}
                                                    displayDataTypes={false}
                                                    enableClipboard={false}
                                                    style={{ fontSize: "0.8rem" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    : ""
                }


                {/* Dashboard Content */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Benachrichtigung</h2>
                        <p className="text-gray-700 mt-2">Hier werden ggf. Systemmeldungen angezeigt.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Zusammenfassung der Kurswahl</h2>
                        <p className="text-gray-700 mt-2">Kurze Zusammenfassung, bzw. Infos zu Nutzerabgaben etc.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Kurswahl-Deadline</h2>
                        <p className="text-gray-700 mt-2">Datum bis zur Abgabe, ggf. Anzeige zu verbleibenden Tagen.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}