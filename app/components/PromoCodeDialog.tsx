"use client";
import { useEffect, useRef, useState } from "react";
import { Ticket, X } from "lucide-react";
import { useBooking } from "./BookingContext";

interface PromoCodeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PromoCodeDialog({ open, onClose }: PromoCodeDialogProps) {
  const { activeTab, dataByTab, updateTabData } = useBooking();
  const currentCode = dataByTab[activeTab]?.promoCode || "";
  const [code, setCode] = useState(currentCode);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (open) setCode(currentCode); }, [open, currentCode]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Promo Code / Shukran Id"
        ref={ref}
        className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
      >
        <div className="p-5 md:p-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-black">Add Promo Code / Shukran Id</h2>
          <button onClick={onClose} aria-label="Close" className="text-black hover:text-red-600 p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 md:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black"><Ticket size={18} /></span>
              <input
                type="text"
                value={code.toUpperCase()}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Put your Promo Code / Shukran Id here"
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-3 text-base md:text-sm font-bold text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="button"
              onClick={() => { updateTabData(activeTab, { promoCode: code.trim() }); onClose(); }}
              className="bg-red-600 text-white px-6 py-3 md:py-2 rounded-md text-base md:text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >Submit</button>
          </div>
          <hr />
          <p className="text-sm md:text-base text-black font-medium">Maximize your savings with our exclusive promo code! / Shukran Id!</p>
        </div>
      </div>
    </div>
  );
}
