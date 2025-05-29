"use client";
import { useState, useEffect } from "react"; // <-- useState ergänzt
import Sidebar from "@/components/Sidebar";
import useErrorLogger from "@/app/userarea/admin/dashboard/errorProjection/useErrorLogger";

export default function SettingsDashboard() {
    const [, setErrors] = useErrorLogger("Einstellungen");

    const [submitted, setSubmitted] = useState(() => {
        const stored = localStorage.getItem("submitted");
        return stored ? Number(stored) : 0;
    });
    const [total, setTotal] = useState(() => {
        const stored = localStorage.getItem("total");
        return stored ? Number(stored) : 0;
    });
    const [userCount, setUserCount] = useState(() => {
        const stored = localStorage.getItem("userCount");
        return stored ? Number(stored) : 0;
    });
    const [teacherCount, setTeacherCount] = useState(() => {
        const stored = localStorage.getItem("teacherCount");
        return stored ? Number(stored) : 0;
    });
    const [adminCount, setAdminCount] = useState(() => {
        const stored = localStorage.getItem("adminCount");
        return stored ? Number(stored) : 0;
    });
    const [deadline, setDeadline] = useState(() => {
        const stored = localStorage.getItem("courseDeadline");
        return stored ? new Date(stored) : new Date("2025-03-15");
    });

    useEffect(() => {
        if (deadline) {
            localStorage.setItem("courseDeadline", deadline.toISOString());
        }
    }, [deadline]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Einstellungen</h1>
                </header>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Eingereichte Wahlen */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-900">Dashboard Werte:</h2>
                        <input
                            type="number"
                            min="0"
                            className="mt-2 p-2 border rounded w-full"
                            value={submitted}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setSubmitted(value);
                                localStorage.setItem("submitted", value.toString());
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Anzahl an eingereichten Wahlen: <strong>{submitted}</strong> 
                        </p>
                        <input
                            type="number"
                            min="0"
                            className="mt-2 p-2 border rounded w-full"
                            value={total}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setTotal(value);
                                localStorage.setItem("total", value.toString());
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Insgesamte Anzahl an Schüler:innen: <strong>{total}</strong> 
                        </p>
                        <input
                            type="number"
                            min="0"
                            className="mt-2 p-2 border rounded w-full"
                            value={userCount}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setUserCount(value);
                                localStorage.setItem("userCount", value.toString());
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Anzahl an Nutzern: <strong>{userCount}</strong>
                        </p>
                        <input
                            type="number"
                            min="0"
                            className="mt-2 p-2 border rounded w-full"
                            value={teacherCount}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setTeacherCount(value);
                                localStorage.setItem("teacherCount", value.toString());
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Anzahl an Lehrern: <strong>{teacherCount}</strong>
                        </p>
                        <input
                            type="number"
                            min="0"
                            className="mt-2 p-2 border rounded w-full"
                            value={adminCount}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setAdminCount(value);
                                localStorage.setItem("adminCount", value.toString());
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Anzahl an Administrator:innen: <strong>{adminCount}</strong>
                        </p>
                        <input
                            type="date"
                            className="mt-2 p-2 border rounded w-full"
                            value={deadline.toISOString().split("T")[0]}
                            onChange={(e) => setDeadline(new Date(e.target.value))}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Aktuelle Deadline gesetzt auf: <strong>{deadline.toLocaleDateString("de-DE")}</strong>
                        </p>
                    </div>

                    {/* Modus */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Modus</h2>
                        <p className="text-gray-700 mt-2">Altes Design vs. neues Design.</p>
                    </div>

                    {/* Kontaktpersonen */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Kontaktpersonen</h2>
                        <p className="text-gray-700 mt-2">Name, E-Mail-Adresse, Sekreteriat-Telefonnummer.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Verlinkungen</h2>
                        <p className="text-gray-700 mt-2">Hier werden schulisch relevante Webseiten verlinkt.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}