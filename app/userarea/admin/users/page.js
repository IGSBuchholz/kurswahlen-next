"use client"
import Sidebar from "@/components/Sidebar";
import EmailInput from "@/components/EmailInput";
import ButtonPrimary from "@/components/ButtonPrimary";
import {useEffect, useState} from "react";
import {nameFromEmail} from "@/app/userarea/dashboard/page";
import crypto from "crypto";
import Link from "next/link";
import { X } from 'lucide-react'
import {prisma} from "@/utils/prisma";
import {getSession} from "next-auth/react";
import HoursPreview from "@/components/HoursPreview";
import {generateHours} from "@/utils/RulesEngine";

export default function UsersDashboard() {
    const [email, setEmail] = useState("");
    const [currentSearchResults, setCurrentSearchResults] = useState([]);
    const [specificUserData, setSpecificUserData] = useState();
    const [userDataPanelOpen, setUserDataPanelOpen] = useState(false);
    const [adminChangePopup, setAdminChangePopup] = useState(false);
    const [adminChangeEmailInput, setAdminChangeEmailInput] = useState("");
    const [adminChangeError, setAdminChangeError] = useState("");
    const [session, setSession] = useState(null);
    const [cf_stepData, setCf_stepData] = useState();
    const [cf_fileLayout, setCf_fileLayout] = useState();
    const [cf_categorySort, setCf_categorySort] = useState();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (email) {
                searchForUser();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [email]);

    useEffect(() => {

        async function mountSession() {
            setSession(await getSession())
        }
        mountSession()
        async function fetchStepDataAndLayout() {
            try {
                const response = await fetch('/api/rulesengine'); // Your existing API
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.message !== "SUCCESS") {
                    console.error("Rules engine error:", data.message);
                    return null;
                }

                setCf_stepData(data.results.data.Steps)
                setCf_fileLayout(data.results.data.FileLayout)
                setCf_categorySort(data.results.data.CategorySort)

            } catch (error) {
                console.error("Error fetching step data and layout:", error);
                return null;
            }
        }
        fetchStepDataAndLayout()
    }, []);

    useEffect(() => {

        if(!session) return;
        if(!session.user) return;

        console.log("SessionUserFirst",  session.user)

    }, [session]);

    const searchForUser = async () => {
        setUserDataPanelOpen(false);
        console.log("searchForUser");
        const res = await fetch("/api/admin/getuser/?email=" + email);
        const json = await res.json();
        console.log(json)
        let edited = json.results.map((value, index) => {
            let nfE = nameFromEmail(value.email);
            value.fullname = nfE.firstname + " " + nfE.name;
            return value;
        })

        setCurrentSearchResults(edited)
    }

    const getUserProgress = async (email) => {
        console.log("getUserProgress", email)
        const res = await fetch("/api/admin/getusersprogress/?email=" + email);
        const json = await res.json();
        return json.results;
    }

    async function openResult(user, forceReload = false) {
        if(forceReload) {
            user.progress = null;
        }
        console.log("openResult", user)
        setUserDataPanelOpen(true);
        if(specificUserData && !forceReload) {
            if(specificUserData.email === user.email){
                return;
            }
        }
        setSpecificUserData(null);
        const progress = await getUserProgress(user.email);
        let newUser = user;
        newUser.progress = progress;
        setSpecificUserData(newUser);
        console.log(newUser);
    }

    async function changeUserAdminStatus() {
        if (!specificUserData) return;

        console.log("Adminstatus wird geändert");

        const res = await fetch("/api/admin/adminstatus?email=" + email + "&isadmin=" + !specificUserData.isadmin, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: specificUserData.email,
                isadmin: !specificUserData.isadmin
            }),
        });
        console.log("JSON", await res.json());
        if (res.ok) {
            console.log("Adminstatus erfolgreich geändert");
            let newCurrentSearchResults = currentSearchResults;
            newCurrentSearchResults.map((value, index) => {
                if(value.email != specificUserData.email){
                    return value;
                }
                value.isadmin = !value.isadmin;
            })
            setCurrentSearchResults(newCurrentSearchResults);
            setSpecificUserData(null)
        } else {
            console.error("Fehler beim Ändern des Adminstatus");
        }
        openResult(specificUserData, true)
    }

    useEffect(() => {
        setAdminChangeEmailInput("")
        setAdminChangeError("");
    }, [adminChangePopup]);

    function SaveElementAdmin({contextJson, name, saveid, pinned, created_at}) {
        console.log("C",cf_stepData, contextJson)


        const [context, setContext] = useState(new Map())
        useEffect(() => {
            function initializeContext(contextRaw) {
                let loadedContext = new Map()

                let lastEl = "";
                for (const key in contextRaw) {
                    lastEl = key;
                    loadedContext.set(key, contextRaw[key]);
                }
                console.log("loadedContext", loadedContext);
                return loadedContext;
            }
            setContext(initializeContext(contextJson));
        }, [contextJson]);

        const [colors, setColors] = useState(["#ff0000", "#00ff00"]); // Default colors
        const [hours, setHours] = useState([]);

        useEffect(() => {
            setColors(generateColor(context))
            setHours(generateHours(context, cf_stepData))
        }, [context]);

        function generateColor(context) {
            const context_keys = Object.keys(context);
            if (context_keys.length === 0) return ["#ff0000", "#00ff00"]; // Fallback colors

            const key = context_keys[0];
            const getColorFromString = (input) => {
                const hash = crypto.createHash("sha256").update(input).digest("hex");
                return [`#${hash.slice(0, 6)}`, `#${hash.slice(6, 12)}`];
            };

            return getColorFromString(context[key].value);
        }

        function togglePinned() {
        }

        const isPinned = false;
        return (
            <div className={"mb-2"}>
                <section className="">
                    <div className="mx-auto flex max-w-screen-sm items-center justify-center">
                        <div
                            className="min-h-16 w-full rounded-md p-1"
                            style={{
                                background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
                            }}
                        >
                            <details className="w-full bg-white p-4 flex flex-col justify-between items-start">
                                <summary className="flex justify-between items-center w-full cursor-pointer">
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold">{name}</h2>
                                        <p className="text-sm text-gray-500">ID: {saveid}</p>
                                    </div>
                                    <p className="text-gray-400">{created_at.split("T")[0]}</p>
                                </summary>
                                <div className="mt-4">
                                    {/* Add more detailed save data here in the future if needed */}
                                    <HoursPreview pxSize={2.5} pySize={2} categorysort={cf_categorySort} hours={hours}></HoursPreview>
                                </div>
                            </details>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <>
            {adminChangePopup && specificUserData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Willst du wirklich den Adminstatus von {specificUserData.fullname} ändern?</h2>
                        <p className="mb-4">Wenn ja, tippe die E-Mail des Nutzers in das Feld:</p>
                        <input
                            className="border p-2 w-full mb-4"
                            type="text"
                            placeholder={specificUserData.email}
                            value={adminChangeEmailInput}
                            onChange={(e) => setAdminChangeEmailInput(e.target.value)}
                        />
                        {adminChangeError && (
                            <p className="text-red-600 mb-4">{adminChangeError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setAdminChangePopup(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() => {
                                    if (adminChangeEmailInput === specificUserData.email) {
                                        setAdminChangePopup(false);
                                        changeUserAdminStatus();
                                    } else {
                                        setAdminChangeError("Die eingegebene E-Mail stimmt nicht überein.");
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Bestätigen
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 bg-gray-100 p-6 ml-64">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Nutzerverwaltung</h1>
                    </header>

                    {/* Dashboard Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold text-blue-600">Nutzersuche</h2>
                            <p className="text-gray-700 mt-2">Nutzer suchen und ggf. modifizieren</p>
                            <EmailInput email={email} setEmail={setEmail}></EmailInput>
                            <div className={"w-full h-0.5 rounded-2xl bg-gray-200 my-5"}><br></br></div>
                            <p className="text-gray-400 mb-4">
                                {currentSearchResults.length} Suchergebnisse
                            </p>
                            {currentSearchResults.map((result, index) => {

                                    return <div key={"user_" + index} className={"p-4 shadow-2xl rounded-xl mb-4 flex flex-col"}>
                                        <div className="flex justify-between items-center w-full">
                                            <div>
                                                <h2 className={"inline"}>{result.fullname}</h2>
                                                {result.isadmin ? <p className={"inline bg-red-600 text-white p-1 rounded-md font-bold text-sm ml-1"}>ADMIN</p> : ""}
                                            </div>
                                            <button onClick={() => {openResult(result)}} className="text-sm text-blue-600 hover:underline"><p>Details</p></button>
                                        </div>
                                        <div className="inline ml-auto text-right w-full">{result.role}</div>
                                    </div>;
                                }
                            )}
                        </div>
                        {userDataPanelOpen ?
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <div className={"flex justify-between items-center w-full"}>
                                    <h2 className="text-xl font-bold text-blue-600">Nutzer</h2>
                                    <button onClick={() => {
                                        setUserDataPanelOpen(false);
                                    }}><X></X></button>
                                </div>
                                {specificUserData ?
                                    <div>
                                        <div className="mb-4">
                                            <img
                                                className="mx-auto w-24"
                                                alt="Nutzerprofilbild!"
                                                src="/static/media/placeholder/profilepicture.svg"
                                            />
                                            <h3 className="text-lg font-semibold text-center">{specificUserData.fullname}</h3>
                                            <h3 className="text-lg font-semibold text-center text-gray-400">{specificUserData.email}</h3>
                                            <label className="flex items-center space-x-2">
                                    <span
                                        className={"inline bg-red-600 text-white p-0.5 rounded-md font-bold text-sm ml-1"}>ADMIN</span>
                                                <input
                                                    type="checkbox"
                                                    checked={specificUserData.isadmin}
                                                    disabled={session.user.email.toLowerCase() == specificUserData.email.toLowerCase()}
                                                    onChange={() => { setAdminChangePopup(true); }}
                                                    readOnly
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                            </label>
                                        </div>
                                        <div className={"w-full h-0.5 rounded-2xl bg-gray-200 my-5"}><br></br></div>
                                        {specificUserData.progress.map((progress, index) => (
                                            <SaveElementAdmin key={"saveelementadmin_" + progress.id} contextJson={JSON.parse(progress.savedata)} name={progress.savename} created_at={progress.created_at} saveid={progress.id} pinned={progress.pinned} />
                                        ))}
                                    </div>
                                    : <div role="status">
                                        <svg aria-hidden="true"
                                             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"/>
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                }
                            </div>
                            : ""}

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold text-blue-600">Konfiguration</h2>
                            <p className="text-gray-700 mt-2">Konfiguriere die Fächer etc. pp.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}