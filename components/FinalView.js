import ButtonPrimary from "@/components/ButtonPrimary";
import HoursPreview from "@/components/HoursPreview";
import dynamic from "next/dynamic";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {ExportAsPDFButton} from "@/utils/PDFCreator";
import {getSession} from "next-auth/react";
import {nameFromEmail} from "@/app/userarea/dashboard/page";

export default function FinalView({hours, categorysort, lines, context}) {
    let [studentName, setStudentName] = useState("");
    let [session, setSession] = useState(null);
    let klasse = "11c"
    let digitaleAbgabe = true

    useEffect(() => {

        async function mountSession() {
            setSession(await getSession())
        }

        mountSession()
    }, [])

    useEffect(() => {

        if(!session) return;
        if(!session.user) return;

        const n = nameFromEmail(session.user.email)

        setStudentName(n.firstname + " " + n.lastname)


    }, [session]);

    return <>
        <div className={"block"}>
            <h2 className={"font-bold text-xl"}>Vorschau</h2>
            <h4 className={"text-gray-500 mb-6"}>Hier siehst du die Vorschau deiner Kurse und Stunden! <br></br> Überprüfe nochmal ob alles so ist, wie du willst!</h4>
            <HoursPreview id={"hourspreview"} hours={hours} categorysort={categorysort}></HoursPreview>
            {digitaleAbgabe ? <div className={"mt-4"}>
                <ButtonPrimary callback={() => {
                }} text={"Digital abgeben!"} isActive={true}></ButtonPrimary>
            </div> : ""}
            <div className={"mt-4"}>
                {studentName != "" ? <ExportAsPDFButton context={context} hours={hours} lines={lines} categorysort={categorysort} classname={klasse} studentname={studentName}></ExportAsPDFButton> : ""}
            </div>
        </div>

    </>

}