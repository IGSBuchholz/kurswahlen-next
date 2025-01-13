"use client"
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Übersicht</h1>
                </header>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Benachrichtigung</h2>
                        <p className="text-gray-700 mt-2">Hier werden ggf. Systemmeldungen angezeigt.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Zusammenfassung der Kurswahl</h2>
                        <p className="text-gray-700 mt-2">Kurze Zusammenfassung, bzw. Infos zu Nutzerabgaben etc.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Kurswahl-Deadline</h2>
                        <p className="text-gray-700 mt-2">Datum bis zur Abgabe, ggf. Anzeige zu verbleibenden Tagen.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}