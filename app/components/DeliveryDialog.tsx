"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Truck, X } from "lucide-react";

import { useBooking } from "./BookingContext";

interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  /** Which location field to update: pickup or returnLoc */
  target: "pickup" | "returnLoc";
}

const CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

export default function DeliveryDialog({ open, onClose, onBack, target }: DeliveryDialogProps) {
  const { activeTab, dataByTab, updateTabData } = useBooking();
  const sameReturn = dataByTab[activeTab]?.sameReturn;
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const handleClick = (e: MouseEvent) => { if (!ref.current || ref.current.contains(e.target as Node)) return; onClose(); };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("mousedown", handleClick); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-label={target === 'pickup' ? 'Deliver to me' : 'Collect from me'} aria-modal="true" className="z-50 w-screen rounded-none border-0 bg-white shadow-none text-sm overflow-hidden px-0 md:px-8 py-0 md:py-4 fixed inset-0 md:static h-screen md:h-auto" style={{ maxWidth: "90vw" }}>
      <div ref={ref} className="w-full mx-auto bg-white rounded-none md:rounded-2xl shadow-xl overflow-hidden h-full md:h-auto flex flex-col">
        <div className="p-4 md:p-6 border-b flex items-center gap-4">
          <button onClick={onBack} className="border rounded-md px-4 py-2 text-base font-medium hover:bg-gray-50 flex items-center gap-2 text-black"><ArrowLeft size={18} /> Back</button>
          <h2 className="text-2xl font-semibold text-black flex items-center gap-3">
            <Truck size={22} /> {target === 'pickup' ? 'Deliver to me' : 'Collect from me'}
          </h2>
          <div className="ml-auto">
            <button onClick={onClose} aria-label="Close" className="p-2 text-gray-600 hover:text-black"><X size={22} /></button>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <label className="block text-base font-semibold text-black mb-2">City</label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 px-4 py-3 pr-10 text-base font-bold focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                >
                  <option value="">Choose City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black text-lg">▾</span>
              </div>
            </div>
            <div className="md:col-span-5">
              <label className="block text-base font-semibold text-black mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Write down your address here"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-red-500 text-black placeholder-gray-400"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                disabled={!city && !address}
                onClick={() => {
                  const full = `${city}${city && address ? ', ' : ''}${address}`.trim();
                  if (target === "pickup") {
                    if (sameReturn) {
                      updateTabData(activeTab, { pickupLocation: full, returnLocation: full });
                    } else {
                      updateTabData(activeTab, { pickupLocation: full });
                    }
                  } else {
                    updateTabData(activeTab, { returnLocation: full });
                  }
                  onClose();
                }}
                className="w-full bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-md px-6 py-3 text-base font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
