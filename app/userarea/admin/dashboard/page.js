"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

// Benutzerinformationen
const userStats = {
    users: 150,
    teachers: 30,
    admins: 5,
    lastAdminLogin: "Max Mustermann (24.02.2025, 14:32 Uhr)" // Platzhalter
};

// Daten für eingereichte Wahlen
const courseSelectionStats = {
    submitted: 120,
    remaining: 80
};

// Fehlerüberwachung
function useErrorLogger() {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const handleError = (event) => {
            setErrors(prevErrors => [...prevErrors, event.message]);
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", (event) => handleError({ message: event.reason?.message || "Unbekannter Promise-Fehler" }));

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleError);
        };
    }, []);

    return [errors, setErrors];
}

export default function AdminDashboard() {
    const [deadline, setDeadline] = useState(new Date("2025-03-15"));
    const [daysLeft, setDaysLeft] = useState(0);
    const [errors, setErrors] = useErrorLogger();

    useEffect(() => {
        const today = new Date();
        const timeDiff = deadline - today;
        setDaysLeft(Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24))));
    }, [deadline]);

    // Funktion für den Fehler-Button
    const triggerError = () => {
        try {
            throw new Error("Test-Fehler: Dieser Fehler wurde absichtlich erzeugt!");
        } catch (error) {
            setErrors(prevErrors => [...prevErrors, error.message]);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Admin Übersicht</h1>
                </header>

                {/* Dashboard Content */}
                <div className="space-y-8">
                    
                    {/* Eingereichte Wahlen */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Eingereichte Wahlen</h2>
                        <div className="relative w-40 h-40 mx-auto mt-6 rounded-full" 
                             style={{ background: `conic-gradient(#4CAF50 ${(courseSelectionStats.submitted / 200) * 100}%, #FF5252 ${(courseSelectionStats.submitted / 200) * 100}% 100%)` }}>
                        </div>
                        <p className="text-lg mt-4 text-center">Eingereicht: <span className="font-bold">{courseSelectionStats.submitted} / 200</span></p>
                    </div>

                    {/* Benutzeraktivität */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Benutzeraktivität</h2>
                        <p className="text-lg text-gray-700 mt-4">👤 Nutzer: <span className="font-bold">{userStats.users}</span></p>
                        <p className="text-lg text-gray-700">👨‍🏫 Lehrer: <span className="font-bold">{userStats.teachers}</span></p>
                        <p className="text-lg text-gray-700">🛠️ Admins: <span className="font-bold">{userStats.admins}</span></p>
                        <p className="text-lg text-gray-700">📅 Letzter Admin-Zugriff: <span className="font-bold">{userStats.lastAdminLogin}</span></p>
                    </div>

                    {/* Kurswahl-Deadline */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Kurswahl-Deadline</h2>
                        <p className="text-lg mt-4 text-red-600">📅 Abgabefrist: <span className="font-bold">15. März 2025</span></p>
                        <p className={`mt-4 text-2xl font-bold ${daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}>
                            {daysLeft} Tage verbleibend
                        </p>
                    </div>

                    {/* Systemstatus */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Systemstatus</h2>
                        {errors.length > 0 ? (
                            errors.map((error, index) => (
                                <p key={index} className="text-lg text-red-600">⚠️ {error}</p>
                            ))
                        ) : (
                            <p className="text-lg text-green-600">✅ Keine Fehler vorhanden</p>
                        )}

                        {/* Fehler provozieren-Button */}
                        <button 
                            onClick={triggerError} 
                            className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition duration-200"
                        >
                            Fehler provozieren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}