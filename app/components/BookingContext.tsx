"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { BookingData } from "./BookingPanel";

interface BookingContextValue {
  dataByTab: Record<string, BookingData>;
  activeTab: string;
  setActiveTab: (k: string) => void;
  updateTabData: (tab: string, patch: Partial<BookingData>) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

// Build initial data with default pickup today and return tomorrow
function buildInitial(): Record<string, BookingData> {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const fmt = (d: Date, time: string) => {
    const day = d.getDate();
    const monthShort = d.toLocaleString("en", { month: "short" });
    return `${day} ${monthShort} ${d.getFullYear()} | ${time}`;
  };
  const pickup = fmt(now, "9:00 AM");
  const ret = fmt(tomorrow, "9:00 AM");
  return {
    start: { pickupLocation: "", returnLocation: "", sameReturn: true, pickupDateTime: pickup, returnDateTime: ret, promoCode: "" },
    monthly: { pickupLocation: "", returnLocation: "", sameReturn: true, pickupDateTime: pickup, returnDateTime: ret, promoCode: "" }
  };
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [dataByTab, setDataByTab] = useState<Record<string, BookingData>>(() => buildInitial());
  const [activeTab, setActiveTab] = useState<string>("start");

  const updateTabData = (tab: string, patch: Partial<BookingData>) => {
    setDataByTab(prev => ({ ...prev, [tab]: { ...prev[tab], ...patch } }));
  };

  return (
    <BookingContext.Provider value={{ dataByTab, activeTab, setActiveTab, updateTabData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
