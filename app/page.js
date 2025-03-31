"use client";
import {useEffect, useState} from "react";
import LoginButton from "@/components/LoginButton";
import LinkButtonPrimary from "@/components/LinkButtonPrimary";
import {prisma} from "@/utils/prisma";
import { GetStaticProps } from "next";

export default function Home({ accordionData }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const [faqs, setFaqs] = useState([]);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    useEffect(() => {
        async function loadFaqEl() {
            const res = await fetch("/api/homepage/accordion", {});
            const data = await res.json();
            const sortedData = data.sort((a, b) => a.id - b.id); // Sort FAQs by id
            console.log(sortedData);
            setFaqs(sortedData);
            console.log(sortedData);
        }
        loadFaqEl()
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            setMousePosition({ x: clientX, y: clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const getTransformStyle = (offsetX, offsetY) => {
        return {
            transform: `translateY(${Math.sin(Date.now() / 1000 + offsetX) * 5}px) 
                        rotateX(${(mousePosition.y - window.innerHeight ) / 50 + offsetY}deg) 
                        rotateY(${(mousePosition.x - window.innerWidth ) / 50 + offsetX}deg)`,
            transition: "transform 0.1s ease-out",
        };
    };

    useEffect(() => {
        console.log(accordionData)
    }, [accordionData]);

    return (
        <>
            <div className="relative flex items-center justify-center h-screen bg-gray-100" onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}>
                {/* Floating 3D elements */}
                <div>
                    <h2 src="/school.png" alt="School Icon" className="absolute top-10 left-20 w-16 text-7xl"
                        style={getTransformStyle(10, -10)}>🏫</h2>
                    <h2 src="/graduation.png" alt="Graduation Cap" className="absolute top-10 right-20 w-16 text-7xl"
                        style={getTransformStyle(-10, 10)}>🎓</h2>
                    <h2 src="/pencil.png" alt="Pencil" className="absolute bottom-10 left-40 w-12 text-7xl"
                        style={getTransformStyle(5, -5)}>✏️</h2>
                    <h2 src="/book.png" alt="Book" className="absolute bottom-10 right-40 w-14 text-7xl "
                        style={getTransformStyle(-5, 5)}>📕</h2>
                </div>

                {/* Centered text */}
                <div className="text-center">
                    <h1 className="font-mono text-7xl mb-4">kurswahl<b className={""}>Tool</b></h1>
                    <LinkButtonPrimary text={"Auf gehts!"} link={"/userarea/dashboard"}></LinkButtonPrimary>
                </div>
            </div>
            <div className={"w-full bg-gray-100"}>
                <div className="faq-accordion container mx-auto p-4">
                    <div className="text-left mb-4">
                      <h2 className="text-3xl font-bold">FAQ</h2>
                    </div>
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item border-b border-gray-300 py-2">
                            <h3
                                className="faq-question text-lg font-medium cursor-pointer"
                                onClick={() => toggleFaq(index)}
                            >
                                {faq.question}
                            </h3>
                            <p className={`faq-answer mt-2 text-gray-700 transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}
