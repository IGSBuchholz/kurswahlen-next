"use client";
import HoursPreview from "@/components/HoursPreview";
import { useSearchParams } from 'next/navigation'

export default function Render({}) {
    const searchParams = useSearchParams()

    const hours = JSON.parse(searchParams.get('hours'))
    const categorysort = JSON.parse(searchParams.get('categorysort'))
    const studentname = searchParams.get('studentname')
    const classname = searchParams.get('classname')


    return <>
        <h1>Kurswahlen - IGS Buchholz</h1>
        <h2>Name: {studentname}</h2>
        <h2>Klasse: {classname}</h2>
        <HoursPreview hours={hours} categorysort={categorysort}></HoursPreview>

    </>

}