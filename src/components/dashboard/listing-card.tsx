"use client";

import { Building2, MapPin, Euro, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
    listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const handleApply = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tenant/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId: listing.id }),
            });

            if (res.ok) {
                setHasApplied(true);
            } else {
                alert("Erreur lors de la candidature");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">
            <div className="h-32 bg-neutral-800 flex items-center justify-center relative">
                {/* Placeholder image logic */}
                <Building2 className="h-12 w-12 text-neutral-600" />
                <div className="absolute top-2 right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    Compatible
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="font-bold text-white text-lg truncate">{listing.title}</h3>
                    <div className="flex items-center text-neutral-400 text-sm gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{listing.city} ({listing.zipCode})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-white font-medium">
                        <Euro className="h-4 w-4 text-neutral-400" />
                        {listing.rentAmount} / mois
                    </div>
                    <div className="text-neutral-400">
                        {listing.surface} m² • {listing.rooms} p.
                    </div>
                </div>

                {hasApplied ? (
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-green-500/10 text-green-500 font-medium py-2 rounded-md border border-green-500/20 cursor-default"
                    >
                        <CheckCircle className="h-4 w-4" /> Candidature envoyée
                    </button>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={isLoading}
                        className={cn(
                            "w-full flex items-center justify-center font-medium py-2 rounded-md transition-colors",
                            "bg-white text-black hover:bg-neutral-200 disabled:opacity-50"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Postuler en 1 clic"}
                    </button>
                )}
            </div>
        </div>
    );
}
