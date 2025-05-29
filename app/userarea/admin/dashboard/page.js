"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

import dynamic from 'next/dynamic'; //~ Pull request
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false }); //~ Pull request

import useErrorLogger from "@/app/userarea/admin/dashboard/errorProjection/useErrorLogger";


export default function AdminDashboard() {
  
    const [servicesStatus, setServicesStatus] = useState({}); //~ Pull request
  
    const [courseSelection, setCourseSelection] = useState(() => {
        const submitted = localStorage.getItem("submitted");
        const total = localStorage.getItem("total");
        return {
            submitted: submitted ? Number(submitted) : 0,
            total: total ? Number(total) : 0
        };
    });
    const [deadline, setDeadline] = useState(() => {
        const saved = localStorage.getItem("courseDeadline");
        return saved ? new Date(saved) : new Date("2025-03-15");
    });
    const [daysLeft, setDaysLeft] = useState(0);
    const [errors] = useErrorLogger("Dashboard");

    const [userStats, setUserStats] = useState(() => {
        const users = localStorage.getItem("userCount");
        const teachers = localStorage.getItem("teacherCount");
        const admins = localStorage.getItem("adminCount");
        const lastDate = localStorage.getItem("lastAccessDate");
        const lastTime = localStorage.getItem("lastAccessTime");

        return {
            users: users ? Number(users) : 0,
            teachers: teachers ? Number(teachers) : 0,
            admins: admins ? Number(admins) : 0,
            lastAdminAccess: {
                name: "Kilian",
                date: lastDate || "Unbekannt",
                time: lastTime || "Unbekannt"
            }
        };
    });

  
  //~ Pull request
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
  //~ Pull request
  
  
    useEffect(() => {
        const savedSubmitted = localStorage.getItem("submitted");
        const savedTotal = localStorage.getItem("total");

        const savedUsers = localStorage.getItem("userCount");
        const savedTeachers = localStorage.getItem("teacherCount");
        const savedAdmins = localStorage.getItem("adminCount");

        const lastDate = localStorage.getItem("lastAccessDate");
        const lastTime = localStorage.getItem("lastAccessTime");
        const currentAdmin = "Kilian";

        const savedDeadline = localStorage.getItem("courseDeadline");

        setCourseSelection({
            submitted: savedSubmitted ? Number(savedSubmitted) : 0,
            total: savedTotal ? Number(savedTotal) : 0
        });

        setUserStats(prev => ({
            ...prev,
            users: savedUsers ? Number(savedUsers) : 0,
            teachers: savedTeachers ? Number(savedTeachers) : 0,
            admins: savedAdmins ? Number(savedAdmins) : 0,
            lastAdminAccess: {
                name: currentAdmin,
                date: lastDate || "Unbekannt",
                time: lastTime || "Unbekannt"
            }
        }));

        if (savedDeadline) {
            setDeadline(new Date(savedDeadline));
        }
    }, [pathname]);

    useEffect(() => {
        localStorage.setItem("submitted", courseSelection.submitted);
        localStorage.setItem("total", courseSelection.total);
    }, [courseSelection]);

    useEffect(() => {
        localStorage.setItem("userCount", userStats.users);
        localStorage.setItem("teacherCount", userStats.teachers);
        localStorage.setItem("adminCount", userStats.admins);
    }, [userStats.users, userStats.teachers, userStats.admins]);

    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString("de-DE");
        const formattedTime = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        localStorage.setItem("lastAccessDate", formattedDate);
        localStorage.setItem("lastAccessTime", formattedTime);
    }, []);

    useEffect(() => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const timeDiff = deadlineDate - today;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysLeft(days);
        localStorage.setItem("courseDeadline", deadline.toISOString());
    }, [deadline]);

    const triggerError = () => {
        throw new Error("Test-Fehler: Dieser Fehler wurde absichtlich erzeugt!");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Admin-Übersicht</h1>
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
                                    <div key={service}
                                         className={`p-4 rounded shadow ${isConnected ? "bg-green-100" : "bg-red-100"}`}>
                                        <h2 className="text-xl capitalize flex justify-between items-center mb-2">
                                            <span
                                                className={`font-semibold ${isConnected ? "text-green-800" : "text-red-800"}`}>
                                                {service.replace("_", " ")}
                                            </span>
                                            <span
                                                className={`text-sm ${isPending ? "text-yellow-800" : isConnected ? "text-green-800" : "text-red-800"}`}>
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
                                                    style={{fontSize: "0.8rem"}}
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
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Benachrichtigung</h2>
                        <p className="text-gray-700 mt-2">Hier werden ggf. Systemmeldungen angezeigt.</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Eingereichte Wahlen</h2>
                        <div className="relative w-40 h-40 mx-auto mt-6 rounded-full"
                             style={{
                                 background: `conic-gradient(#000266 ${(courseSelection.submitted / courseSelection.total) * 100}%,#ff0101 ${(courseSelection.submitted / courseSelection.total) * 100}% 100%)`
                             }}
                        ></div>
                        <p className="text-lg mt-4 text-center">
                            Eingereicht: <span
                            className="font-bold">{courseSelection.submitted} / {courseSelection.total}</span>
                        </p>
                        <p className="text-sm text-center text-blue-600 font-semibold">
                            {Math.round((courseSelection.submitted / courseSelection.total) * 100)}% eingereicht
                        </p>
                        <p className="text-sm text-center text-gray-600">
                            Ausstehend: {Math.max(courseSelection.total - courseSelection.submitted, 0)}
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <input
                                type="number"
                                min="0"
                                value={courseSelection.submitted}
                                onChange={(e) =>
                                    setCourseSelection((prev) => ({
                                        ...prev,
                                        submitted: Math.min(Number(e.target.value), prev.total)
                                    }))
                                }
                                className="p-2 border border-gray-300 rounded w-28"
                                placeholder="Eingereicht"
                            />
                            <input
                                type="number"
                                min="1"
                                value={courseSelection.total}
                                onChange={(e) =>
                                    setCourseSelection((prev) => ({
                                        ...prev,
                                        total: Math.max(1, Number(e.target.value))
                                    }))
                                }
                                className="p-2 border border-gray-300 rounded w-28"
                                placeholder="Gesamt"
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Benutzeraktivität</h2>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-lg text-gray-700">👤 Nutzer: <span
                                className="font-bold">{userStats.users}</span></p>
                            <input
                                type="number"
                                min="0"
                                value={userStats.users}
                                onChange={(e) =>
                                    setUserStats((prev) => ({
                                        ...prev,
                                        users: Number(e.target.value)
                                    }))
                                }
                                className="p-1 border border-gray-300 rounded w-28 text-right"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-lg text-gray-700">👨‍🏫 Lehrer: <span
                                className="font-bold">{userStats.teachers}</span></p>
                            <input
                                type="number"
                                min="0"
                                value={userStats.teachers}
                                onChange={(e) =>
                                    setUserStats((prev) => ({
                                        ...prev,
                                        teachers: Number(e.target.value)
                                    }))
                                }
                                className="p-1 border border-gray-300 rounded w-28 text-right"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-lg text-gray-700">🛠️ Admins: <span
                                className="font-bold">{userStats.admins}</span></p>
                            <input
                                type="number"
                                min="0"
                                value={userStats.admins}
                                onChange={(e) =>
                                    setUserStats((prev) => ({
                                        ...prev,
                                        admins: Number(e.target.value)
                                    }))
                                }
                                className="p-1 border border-gray-300 rounded w-28 text-right"
                            />
                        </div>
                        <p className="text-lg text-gray-700 mt-4">
                            📅 Letzter
                            Admin-Zugriff: <strong>{userStats.lastAdminAccess.name} ({userStats.lastAdminAccess.date}, {userStats.lastAdminAccess.time} Uhr)</strong>
                        </p>

                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Kurswahl-Deadline</h2>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-lg text-red-600">📅 Abgabefrist: <span
                                className="font-bold">{deadline.toLocaleDateString("de-DE")}</span></p>
                            <input
                                type="date"
                                value={deadline.toISOString().split('T')[0]}
                                onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    setDeadline(date);
                                    localStorage.setItem("courseDeadline", date.toISOString());
                                }}
                                className="p-1 border border-gray-300 rounded w-40 text-right"
                            />
                        </div>
                        <p className={`mt-4 text-2xl font-bold ${daysLeft < 0 ? "text-yellow-500" : daysLeft === 0 ? "underline text-gray-600" : daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}>
                            {daysLeft > 0 && `${daysLeft} Tage verbleibend`}
                            {daysLeft === 0 && new Date().toDateString() === deadline.toDateString() && "Letzter Abgabetag – heute!"}
                            {daysLeft < 0 && new Date().toDateString() !== deadline.toDateString() && "Abgabefrist überschritten"}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-blue-600">Systemstatus</h2>
                        {errors.length > 0 ? (
                            errors.map((error, index) => (
                                <div key={index} className="text-sm text-red-700 my-2">
                                    <p><strong>⚠️ {error.context}</strong> ({error.timestamp})</p>
                                    <p>{error.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-lg text-green-600">✅ Keine Fehler vorhanden</p>
                        )}
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
