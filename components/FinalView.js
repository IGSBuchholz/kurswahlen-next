import ButtonPrimary from "@/components/ButtonPrimary";
import HoursPreview from "@/components/HoursPreview";
import dynamic from "next/dynamic";
import {useRef} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {ExportAsPDFButton} from "@/utils/PDFCreator";

export default function FinalView({hours, categorysort, lines}) {
    let studentName = "Max Mustermann"
    let klasse = "11c"
    let digitaleAbgabe = true

    let printFinalView = () => {

    }

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
                <ExportAsPDFButton hours={hours} lines={lines} categorysort={categorysort} classname={klasse} studentname={studentName}></ExportAsPDFButton>
            </div>
        </div>

    </>

}