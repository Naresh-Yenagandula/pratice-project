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
    <div role="dialog" aria-label="Add Promo Code / Shukran Id" aria-modal="true" className="z-50 w-screen rounded-none border-0 bg-white shadow-none text-base overflow-hidden px-0 md:px-8 py-0 md:py-4 fixed inset-0 md:static h-screen md:h-auto" style={{ maxWidth: "80vw" }}>
      <div ref={ref} className="w-full mx-auto bg-white rounded-none md:rounded-2xl shadow-xl md:max-w-xl overflow-hidden h-full md:h-auto flex flex-col">
        <div className="p-5 md:p-7 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold text-black">Add Promo Code / Shukran Id</h2>
          <button onClick={onClose} aria-label="Close" className="text-black hover:text-red-600 p-1">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 md:p-7 space-y-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black"><Ticket size={18} /></span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Put your Promo Code / Shukran Id here"
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-3 text-base font-bold text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="button"
              onClick={() => { updateTabData(activeTab, { promoCode: code.trim() }); onClose(); }}
              className="bg-red-600 text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >Submit</button>
          </div>
          <hr />
          <p className="text-base text-black font-medium">Maximize your savings with our exclusive promo code! / Shukran Id!</p>
        </div>
      </div>
    </div>
  );
}
