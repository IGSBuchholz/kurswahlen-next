import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import PropTypes from "prop-types";
import LinkButtonPrimary from "@/components/LinkButtonPrimary";

export default function Sidebar() {
    const pathName = usePathname();
    return (
        <div
        className={`bg-gray-800 text-white h-full w-64 
            transition-all duration-300 fixed`}
        >
            <nav className="mt-4">
                <h1 className={"text-center text-2xl underline font-bold"}>Admin-Bereich</h1>
                <ul>
                    <RoutingLink page={"Dashboard"} text={"Dashboard"}></RoutingLink>
                    <RoutingLink page={"Users"} text={"Nutzer"}></RoutingLink>
                    <RoutingLink page={"Selectionedit"} text={"Kursanpassung"}></RoutingLink>
                    <RoutingLink page={"Simulation"} text={"Simulation"}></RoutingLink>
                    <RoutingLink page={"Config"} text={"Kurswahlkonfiguration"}></RoutingLink>
                    <RoutingLink page={"Settings"} text={"Einstellungen"}></RoutingLink>
                    <li className="p-4 hover:bg-gray-700 underline font-bold">
                        <Link href="/userarea/admin/logout">Logout</Link>
                    </li>
                </ul>
            </nav>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <LinkButtonPrimary text={"Nutzerbereich"} link={"/userarea/dashboard"}></LinkButtonPrimary>
            </div>
        </div>
    );
}

function RoutingLink({ page = "Dashboard", text = "Dashboard" }) {
    const pathName = usePathname();

    return (
        <li
            className={
                "p-4 hover:bg-gray-700 " +
                (pathName.toLowerCase() === "/userarea/admin/" + page.toLowerCase()
                    ? "bg-gray-600"
                    : "")
            }
        >
            <Link prefetch={true} href={"/userarea/admin/" + page.toLowerCase()}>
                {text}
            </Link>
        </li>
    );
}

RoutingLink.propTypes = {
    text: PropTypes.string,
    page: PropTypes.string,
};
