"use client"
import {useSession, signIn, signOut, getSession} from "next-auth/react"
import {getServerSession} from "next-auth";
import {useEffect, useState} from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
export default function LoginButton() {
    const [session, setSession] = useState(null);
    useEffect( () => {
        async function fetchSession() {
             setSession(await getSession())
        }
        fetchSession()
    }, []);
    console.log("Session", session)
    if (session ) {
        return (
            <>
                <h2>Signed in as {session.user.email} <br/></h2>
                {session.user.isadmin ? <p className={"text-red-700"}>ADMIN</p> : <p>"not admin"</p>}
                {JSON.stringify(session)} <br/>
                <ButtonPrimary callback={() => signOut()} text={"Log Out"}></ButtonPrimary>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <ButtonPrimary callback={() => signIn()} text={"Log In"}></ButtonPrimary>
        </>
    )
}