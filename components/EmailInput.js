import { useState, useEffect } from "react";

function EmailInput({ value = "", placeholder = "vorname.nachname", emailValid = false }) {
    const [email, setEmail] = useState(value);
    const [isEmailValid, setIsEmailValid] = useState(emailValid);
    const [uuid, setUuid] = useState(generateUUID());

    // Generate a UUID
    function generateUUID() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
            (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
        );
    }

    // Validate email
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]/;
        return email.length > 0 ? emailPattern.test(email) : false;
    }

    // Handle input event
    function handleInput(event) {
        const updatedEmail = event.target.value.toLowerCase();
        setEmail(updatedEmail);
        setIsEmailValid(validateEmail(updatedEmail));
        console.log(validateEmail(updatedEmail));
    }

    useEffect(() => {
        setUuid(generateUUID());
    }, []);

    return (
        <div className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 w-full">
            <input
                id={uuid}
                className="email-input inline-block p-2"
                type="email"
                value={email}
                placeholder={placeholder}
                onChange={handleInput}
            />
            <div className="inline-block p-2">
                <h4>@igs-buchholz.de</h4>
            </div>
        </div>
    );
}

export default EmailInput;
