"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        // Optional: Lokale Auth-Daten entfernen
        //localStorage.removeItem("authToken");

        // Nach 5 Sekunden zur Login-/Startseite weiterleiten
        const timer = setTimeout(() => {
            router.push("/login"); // Diese Seite musst du noch erstellen
        }, 5000);

        return () => clearTimeout(timer); // Cleanup, falls der Nutzer vorher navigiert
    }, []);

    return (
        <div className="flex h-screen items-center justify-center text-center">
            <h1 className="text-xl font-bold">Logout erfolgreich</h1>
        </div>
    );
}