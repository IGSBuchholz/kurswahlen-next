"use client";
import { useState, useEffect } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";
import {getSession, useSession} from "next-auth/react";
import crypto from 'crypto';


function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function nameFromEmail(email) {
    let mail = email.toLowerCase();
    let split = (mail.split("@")[0]).split(".")
    let firstname = capitalizeFirstLetter(split[0])
    let lastname = capitalizeFirstLetter(split[1])
    if(!split[1]){
        lastname = ""
    }
    return {"firstname": firstname, "name": lastname}

}



function Dashboard() {
    const [debugLogs, setDebugLogs] = useState(["Debug logs will appear here..."]);
    const [statusText, setStatusText] = useState("Deine Kurswahl wird momentan überprüft");
    const [progression, setProgression] = useState(60); // 60% for width calculation
    const [name, setName] = useState(null)
    const [session, setSession] = useState(null);
    const addDebugLog = (message) => {
        setDebugLogs((prevLogs) => [...prevLogs, message]);
    };
    const [saves, setSaves] = useState(null);

    useEffect(() => {
        // onMount equivalent
        console.log("Component mounted");
        addDebugLog("Component mounted");
        async function mountSession() {
            setSession(await getSession())
        }
        mountSession()

        async function retrieveSaves() {

            const res = await fetch("/api/progress/saved/retrieve", {
                method: "GET"
            })

            const json = await res.json();
            if(json.message !== "SUCCESS") {
                console.error(json.message);
            }
            setSaves(json.results);
            console.log(json.results)
        }

        retrieveSaves();
    }, []);



    useEffect(() => {

            if(!session) return;
            if(!session.user) return;

            setName(nameFromEmail(session.user.email))


    }, [session]);

    function getName() {
        return name.firstname + " " + name.name
    }

    return (
        <div className={"bg-gray-100 h-screen"}>
            <div className="container mx-auto p-6">
                <div className={""}>
                    {/* Header */}
                    <header className="mb-8 text-center">
                        <img
                            className="mx-auto"
                            alt="Nutzerprofilbild!"
                            src="/static/media/placeholder/profilepicture.svg"
                        />
                        <div className="text-4xl font-bold text-black mb-2 mt-2">
                            Hallo, <h1 className="text-blue-600 inline">{name ? getName() : "Loading..."}!</h1>
                        </div>
                    </header>

                    {/* Main Dashboard */}
                    <div className="grid grid-cols-1 gap-2 lg:w-1/2 mx-auto">
                        {/* Progression Section */}
                        {
                            session && session.user.isadmin ? <section className="mx-auto">
                                <Link className="p-3 text-white rounded-md text-center bg-red-500"
                                      href={"/userarea/admin/dashboard"} prefetch={true}>
                                    Admin-Dashboard
                                </Link>
                                <div className={"text-white h-3"}>.</div>
                            </section> : ""
                        }

                        <section className={"mx-auto"}>
                            <Link className="p-2 text-white w-full rounded-md text-center bg-blue-500"
                                  href={"/userarea/progress"} prefetch={true}>
                                Neue Konfiguration
                            </Link>
                        </section>

                        <section className={"p-4"}>
                            <div className={"min-h-1 w-full bg-gray-200"}></div>
                        </section>
                        <section>
                            <h1 className={"text-xl text-center"}><b>Gespeicherte Konfigurationen</b></h1>
                        </section>
                        {saves ? saves.map((data) => {
                            return <SaveElement key={"SAVEEL" + data.id} saveid={data.id} pinned={data.pinned}
                                                name={data.savename} context={JSON.parse(data.savedata)}
                                                created_at={data.created_at}></SaveElement>
                        }) : ""}

                    </div>
                </div>
            </div>
        </div>
    );
}

function SaveElement({context, name, saveid, pinned, created_at}) {

    console.log("ID", context)
    const [colors, setColors] = useState(["#ff0000", "#00ff00"]); // Default colors
    useEffect(() => {
        setColors(generateColor(context))
    }, []);


    function generateColor(context) {
        const context_keys = Object.keys(context);
        if (context_keys.length === 0) return ["#ff0000", "#00ff00"]; // Fallback colors

        const key = context_keys[0];
        const getColorFromString = (input) => {
            const hash = crypto.createHash("sha256").update(input).digest("hex");
            return [` #${hash.slice(0, 6)}`, `#${hash.slice(6, 12)}`];
        };

        return getColorFromString(context[key].value);
    }

    function togglePinned() {

    }

    const isPinned = false;
    return (
        <div>
            <section className="">
                <div className="mx-auto flex max-w-screen-sm items-center justify-center">
                    <div
                        className="h-24 w-full rounded-md p-1"
                        style={{
                            background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
                        }}
                    >
                        <div className="h-full w-full bg-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h2
                                    className="text-2xl font-bold"
                                    style={{
                                        color: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`,
                                    }}
                                >
                                    {name}
                                </h2>
                                <p className={"text-gray-400"}>{created_at.split("T")[0]}</p>
                            </div>
                            <Link className="p-3 text-white rounded-md text-center bg-blue-500"
                                href={{
                                    pathname: `/userarea/progress`,
                                    query: {
                                        id: saveid,
                                        contextText: JSON.stringify(context)
                                    }
                                }
                                }
                            >Öffnen</Link>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );


}

export default Dashboard;
