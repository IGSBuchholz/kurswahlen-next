"use client"
import Sidebar from "@/components/Sidebar";

export default function KurswahlSimulationDashboard() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 p-6 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Simulation des Kurwahltools</h1>
                </header>

                {/* Editing Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Prüfungsfächer</h2>
                        <p className="text-gray-700 mt-2">Hier wird testweise eine Prüfungszusammenstellung eingegeben.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Belegverpflichtete Fächer</h2>
                        <p className="text-gray-700 mt-2">Hier wird testweise sonstige Fächerzusammenstellung eingegeben.</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-600">Stundenplan</h2>
                        <p className="text-gray-700 mt-2">Hier wird testweise ein tabellenartiger Stundenplan gezeigt.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}