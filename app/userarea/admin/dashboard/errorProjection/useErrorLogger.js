"use client";
import { useState, useEffect } from "react";

export default function useErrorLogger(context = "Allgemein") {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const handleError = (event) => {
            const now = new Date();
            const timestamp = now.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            });
            const date = now.toLocaleDateString("de-DE");

            const message = {
                context,
                message: event.message,
                timestamp: `${date} ${timestamp}`,
                persistent: true
            };

            setErrors(prev => {
                const updated = [...prev, message].slice(-10);
                return updated;
            });

            const existing = JSON.parse(localStorage.getItem("errorLog") || "[]");
            const updatedErrors = [...existing, message].slice(-10);
            localStorage.setItem("errorLog", JSON.stringify(updatedErrors));
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", (event) =>
            handleError({ message: event.reason?.message || "Unbekannter Promise-Fehler" })
        );

        const stored = JSON.parse(localStorage.getItem("errorLog") || "[]");
        setErrors(stored.slice(-10));

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleError);
        };
    }, []);

    return [errors, setErrors];
}
