"use client";

import { useState } from "react";
import { Mail, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for received alerts
const MOCK_ALERTS = [
    { source: "SeLoger", title: "Appartement 2 pièces Paris 15", price: "950 €", receivedAt: "Il y a 2h" },
    { source: "Leboncoin", title: "T2 Lumieux Proche Métro", price: "890 €", receivedAt: "Il y a 5h" },
    { source: "BienD'ici", title: "Studio Meublé Centre", price: "700 €", receivedAt: "Hier" },
];

export default function AlertsPage() {
    const [copied, setCopied] = useState(false);
    const userAlias = "hadrien.b.8842@l2c-alertes.com"; // Mock alias

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userAlias);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Centralisation des Alertes
                </h1>
                <p className="text-neutral-400 mt-2">
                    Ne ratez plus aucune annonce. Recevez toutes vos alertes (SeLoger, Leboncoin, Jinka...) au même endroit.
                </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 bg-blue-500/10 rounded-full">
                        <Mail className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <h3 className="text-xl font-bold text-white">Votre email unique</h3>
                        <p className="text-sm text-neutral-400">
                            Utilisez cette adresse email lorsque vous créez des alertes sur les sites immobiliers.
                            Nous filtrons les doublons et vous notifions instantanément.
                        </p>

                        <div className="flex items-center gap-2 max-w-md">
                            <div className="bg-black border border-neutral-700 rounded-lg px-4 py-3 flex-1 text-neutral-200 font-mono text-sm">
                                {userAlias}
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
                            >
                                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-neutral-400" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-neutral-500" />
                    Dernières alertes reçues (Simulation)
                </h3>
                <div className="grid gap-3">
                    {MOCK_ALERTS.map((alert, idx) => (
                        <div key={idx} className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg flex items-center justify-between hover:bg-neutral-900 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "text-xs font-bold px-2 py-1 rounded text-black",
                                    alert.source === "SeLoger" ? "bg-blue-200" :
                                        alert.source === "Leboncoin" ? "bg-orange-200" : "bg-yellow-200"
                                )}>
                                    {alert.source}
                                </span>
                                <div>
                                    <p className="text-white font-medium">{alert.title}</p>
                                    <p className="text-xs text-neutral-500">{alert.receivedAt}</p>
                                </div>
                            </div>
                            <span className="text-white font-bold">{alert.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
