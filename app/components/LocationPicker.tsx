"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface LocationPickerProps {
    field: "pickup" | "returnLoc";
    onSelect: (value: string, field: "pickup" | "returnLoc") => void;
    onClose: () => void;
}

interface LocationDetail {
    name: string;
    hours?: string;
    isSatellite?: boolean;
    description?: string;
}

// Mock data with metadata to drive right pane
const AIRPORTS: LocationDetail[] = [
    { name: "Dubai Airport - Terminal 1 (DXB)" },
    { name: "Dubai Airport - Terminal 2 (DXB)" },
    { name: "Dubai Airport - Terminal 3 (DXB)" },
    { name: "Sharjah Airport (SHJ)" },
    { name: "Zayed International Airport (AUH)" }
];

const AREAS: LocationDetail[] = [
    { name: "Dubai Motor City", hours: "Sunday-Saturday : 08:00-22:00", description: "This is a Satellite location (No Physical Counter), Our staff will contact" }
];

export default function LocationPicker({ field, onSelect, onClose }: LocationPickerProps) {
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState<LocationDetail | null>(AREAS[0]);
    const [hoverPreview, setHoverPreview] = useState<LocationDetail | null>(null);

    const filterList = (list: LocationDetail[]) => list.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
    const filteredAirports = filterList(AIRPORTS);
    const filteredAreas = filterList(AREAS);

    // Keep selection if still present; else clear
    useEffect(() => {
        const visibleNames = [...filteredAirports, ...filteredAreas].map(l => l.name);
        if (selected && !visibleNames.includes(selected.name)) {
            setSelected(null);
        }
        if (hoverPreview && !visibleNames.includes(hoverPreview.name)) {
            setHoverPreview(null);
        }
    }, [query]);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        const handleClick = (e: MouseEvent) => { if (!containerRef.current || containerRef.current.contains(e.target as Node)) return; onClose(); };
        window.addEventListener("keydown", handleKey);
        window.addEventListener("mousedown", handleClick);
        return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("mousedown", handleClick); };
    }, [onClose]);

    const choose = (loc: LocationDetail) => { setSelected(loc); setHoverPreview(null); onSelect(loc.name, field); onClose(); };
    const confirmSelection = () => { if (selected) { onSelect(selected.name, field); onClose(); } };

    // Collect navigable items for keyboard support
    const allVisible = [...filteredAirports, ...filteredAreas];
    const [focusIndex, setFocusIndex] = useState<number>(0);
    useEffect(() => {
        // reset focus index when filter changes
        setFocusIndex(0);
    }, [query]);

    const handleListKey = (e: React.KeyboardEvent) => {
        if (allVisible.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusIndex(i => (i + 1) % allVisible.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusIndex(i => (i - 1 + allVisible.length) % allVisible.length);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            choose(allVisible[focusIndex]);
        }
    };

    const activeDetail = hoverPreview || selected;

    return (
        <div
            role="dialog"
            aria-label={field === "pickup" ? "Select pickup location" : "Select return location"}
            ref={containerRef}
            className="z-50 w-screen rounded-none border-0 bg-white shadow-xl text-sm overflow-hidden px-0 md:px-8 py-0 md:py-4 fixed inset-0 md:static h-screen md:h-auto"
        >
            {/* Mobile header */}
            <div className="flex md:hidden items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-black">{field === 'pickup' ? 'Pickup Location' : 'Return Location'}</h2>
                <button onClick={onClose} aria-label="Close" className="p-1 text-gray-600 hover:text-black"><X size={20} /></button>
            </div>
            <div className="flex flex-col md:flex-row md:h-[28rem] h-[calc(100vh-3.5rem)]">
                {/* Left lists */}
                <div className="md:w-1/2 border-r border-gray-200 flex flex-col overflow-hidden" onKeyDown={handleListKey} tabIndex={0} aria-label="Locations list">
                    <div className="flex-1 overflow-y-auto custom-scroll">
                        <div className="py-3">
                            <h4 className="flex items-center gap-2 px-4 mb-2 font-semibold text-black text-base">
                                <span className="text-lg">✈️</span> Airport Locations
                            </h4>
                            <ul className="divide-y divide-gray-100">
                                {filteredAirports.map((a, idx) => {
                                    const globalIndex = idx;
                                    const focused = focusIndex === globalIndex;
                                    return (
                                        <li key={a.name}>
                                            <button
                                                type="button"
                                                onClick={() => choose(a)}
                                                onMouseEnter={() => setHoverPreview(a)}
                                                onMouseLeave={() => setHoverPreview(null)}
                                                className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:outline-none ${selected?.name === a.name ? 'bg-red-50 text-red-700' : focused ? 'ring-2 ring-red-300 text-black' : hoverPreview?.name === a.name ? 'bg-red-50 text-red-600' : 'text-black'}`}
                                            >
                                                {a.name}
                                            </button>
                                        </li>
                                    );
                                })}
                                {filteredAirports.length === 0 && <li className="px-4 py-2 text-xs text-gray-400">No matches</li>}
                            </ul>
                        </div>
                        <div className="py-3 border-t border-gray-200">
                            <h4 className="flex items-center gap-2 px-4 mb-2 font-semibold text-black text-base">
                                <span className="text-lg">🏙️</span> Free Delivery Areas
                            </h4>
                            <ul className="divide-y divide-gray-100">
                                {filteredAreas.map((a, idx) => {
                                    const globalIndex = filteredAirports.length + idx;
                                    const focused = focusIndex === globalIndex;
                                    return (
                                        <li key={a.name}>
                                            <button
                                                type="button"
                                                onClick={() => choose(a)}
                                                onMouseEnter={() => setHoverPreview(a)}
                                                onMouseLeave={() => setHoverPreview(null)}
                                                className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:outline-none ${selected?.name === a.name ? 'bg-red-50 text-red-700' : focused ? 'ring-2 ring-red-300 text-black' : hoverPreview?.name === a.name ? 'bg-red-50 text-red-600' : 'text-black'}`}
                                            >
                                                {a.name}
                                            </button>
                                        </li>
                                    );
                                })}
                                {filteredAreas.length === 0 && <li className="px-4 py-2 text-xs text-gray-400">No matches</li>}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Right detail pane */}
                <div className="flex-1 flex flex-col">
                    <div className="p-5 h-full flex flex-col">
                        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
                            <span className="text-xl">🏢</span> {activeDetail?.name}
                        </h3>
                        <p className="text-base text-black mb-4 font-medium">Sunday-Saturday : 08:00-22:00</p>
                        <div className="flex-1">
                            <div className="h-full w-full rounded-md bg-gray-100 flex items-center justify-center text-black text-sm font-medium">
                                Map placeholder
                            </div>
                        </div>
                        {/* Desktop close */}
                        <div className="hidden md:block absolute top-4 right-4">
                            <button onClick={onClose} aria-label="Close" className="p-1 text-gray-600 hover:text-black"><X size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
