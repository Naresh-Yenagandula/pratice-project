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

const INITIAL: Record<string, BookingData> = {
  start: { pickupLocation: "", returnLocation: "", sameReturn: true, pickupDateTime: "", returnDateTime: "", promoCode: "" },
  monthly: { pickupLocation: "", returnLocation: "", sameReturn: true, pickupDateTime: "", returnDateTime: "", promoCode: "" }
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [dataByTab, setDataByTab] = useState<Record<string, BookingData>>(INITIAL);
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
