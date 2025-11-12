"use client";
"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, Plane, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DateTimeDialogProps {
  open: boolean;
  pickupDateTime: string;
  returnDateTime: string;
  pickupLocation?: string;
  returnLocation?: string;
  onChange: (patch: { pickupDateTime?: string; returnDateTime?: string }) => void;
  onClose: () => void;
  singleMode?: boolean; // when true only one date/time (pickup) is selected
}

function formatDisplay(date: Date, timeLabel: string) {
  const day = date.getDate();
  const monthShort = date.toLocaleString("en", { month: "short" });
  return `${day} ${monthShort} ${date.getFullYear()} | ${timeLabel}`;
}

export default function DateTimeDialog({ open, pickupDateTime, returnDateTime, pickupLocation, returnLocation, onChange, onClose, singleMode }: DateTimeDialogProps) {
  const extractTime = (val: string, fallback: string): string => {
    const parts = val.split("|");
    if (parts.length === 2) return parts[1].trim();
    return fallback;
  };
  const [pickupTime, setPickupTime] = useState(extractTime(pickupDateTime, "8:00 AM"));
  const [returnTime, setReturnTime] = useState(extractTime(returnDateTime, "12:00 AM"));
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const selectingReturn = !singleMode && firstDate !== null && secondDate === null;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const handleClick = (e: MouseEvent) => { if (!dialogRef.current || dialogRef.current.contains(e.target as Node)) return; onClose(); };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("mousedown", handleClick); };
  }, [open, onClose]);

  // Dynamic month navigation
  const [startMonth, setStartMonth] = useState<Date>(new Date(2025, 10, 1)); // initially Nov 2025
  const getMonthDays = (base: Date) => {
    const year = base.getFullYear();
    const month = base.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };
  const monthA = getMonthDays(startMonth);
  const monthB = getMonthDays(new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1));
  const formatMonthLabel = (d: Date) => d.toLocaleString("en", { month: "short" }) + " " + d.getFullYear();
  const goNext = () => setStartMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const goPrev = () => setStartMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const today = new Date();
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = startMonth.getTime() > minMonth.getTime();

  const inRange = (d: Date) => {
    if (!firstDate) return false;
    if (!secondDate && selectingReturn && hoverDate) {
      const start = firstDate < hoverDate ? firstDate : hoverDate;
      const end = firstDate < hoverDate ? hoverDate : firstDate;
      return d >= start && d <= end;
    }
    if (firstDate && secondDate) {
      const start = firstDate < secondDate ? firstDate : secondDate;
      const end = firstDate < secondDate ? secondDate : firstDate;
      return d >= start && d <= end;
    }
    return d.getTime() === firstDate.getTime();
  };

  useEffect(() => {
    if (!open) return;
    if (pickupDateTime) {
      // Parse like "13 Nov 2025 | 8:00 AM"
      const [datePart, timePart] = pickupDateTime.split("|");
      if (timePart) setPickupTime(timePart.trim());
      const segs = datePart.trim().split(" "); // 13 Nov 2025
      if (segs.length === 3) {
        const [dayStr, monthStr, yearStr] = segs;
        const monthIndex = new Date(`${monthStr} 1, 2020`).getMonth();
        const d = new Date(parseInt(yearStr, 10), monthIndex, parseInt(dayStr, 10));
        setFirstDate(d);
      }
    }
    if (returnDateTime) {
      const [datePart, timePart] = returnDateTime.split("|");
      if (timePart) setReturnTime(timePart.trim());
      const segs = datePart.trim().split(" ");
      if (segs.length === 3) {
        const [dayStr, monthStr, yearStr] = segs;
        const monthIndex = new Date(`${monthStr} 1, 2020`).getMonth();
        const d = new Date(parseInt(yearStr, 10), monthIndex, parseInt(dayStr, 10));
        setSecondDate(d);
      }
    }
  }, [open]);

  const handleDayClick = (d: Date) => {
    if (singleMode) {
      setFirstDate(d);
      setSecondDate(null);
      setHoverDate(null);
      onChange({ pickupDateTime: formatDisplay(d, pickupTime), returnDateTime: "" });
      return;
    }
    if (!firstDate) {
      setFirstDate(d);
      onChange({ pickupDateTime: formatDisplay(d, pickupTime) });
    } else if (!secondDate) {
      setSecondDate(d);
      onChange({ returnDateTime: formatDisplay(d, returnTime) });
    } else {
      // restart cycle
      setFirstDate(d);
      setSecondDate(null);
      setHoverDate(null);
      onChange({ pickupDateTime: formatDisplay(d, pickupTime), returnDateTime: "" });
    }
  };
  const handleDayMouseEnter = (d: Date) => { if (selectingReturn) setHoverDate(d); };
  const handleDayMouseLeave = () => { if (selectingReturn) setHoverDate(null); };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Date time selection"
      aria-modal="true"
      className="z-50 w-screen rounded-none border-0 bg-white shadow-none text-base md:text-base lg:text-sm overflow-hidden px-0 md:px-8 py-0 md:py-4 fixed inset-0 md:static h-screen md:h-auto"
      style={{ maxWidth: "80vw" }}
    >
      <div ref={dialogRef} className="w-full mx-auto bg-white rounded-none md:rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden h-full md:h-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base text-black">Select Date & Time</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-600 hover:text-black"><X size={20} /></button>
        </div>
        {/* LEFT SIDE summary */}
        <div className="bg-gray-50 p-5 md:p-7 lg:p-6 border-r overflow-y-auto">
          <div className="flex flex-col space-y-8">
            <div>
              <div className="flex items-center space-x-2">
                <Plane size={20} className="text-black" />
                <h3 className="font-medium text-xl lg:text-lg text-black">{pickupLocation || "Pickup Location"}</h3>
              </div>
              <p className="text-lg lg:text-base text-black mt-2 font-bold">
                <span className="font-bold text-gray-500">Pickup:</span> {firstDate ? formatDisplay(firstDate, pickupTime) : pickupDateTime || "Select"}
              </p>
            </div>
            {!singleMode && (
              <>
                <div className="h-12 border-l ml-4 border-gray-300"></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Plane size={20} className="text-black" />
                    <h3 className="font-medium text-xl lg:text-lg text-black">{returnLocation || "Return Location"}</h3>
                  </div>
                  <p className="text-lg lg:text-base text-black mt-2 font-bold">
                    <span className="font-bold text-gray-500">Return:</span> {secondDate ? formatDisplay(secondDate, returnTime) : returnDateTime || (selectingReturn ? "Select" : "")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {/* RIGHT SIDE calendars & time */}
        <div className="relative p-5 md:p-10 overflow-y-auto">
          <div className="flex items-start justify-between gap-6 relative">
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={() => canGoPrev && goPrev()}
              aria-label="Previous months"
              className={`absolute -left-2 top-2 p-2 rounded-md ${canGoPrev ? 'text-black hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
              disabled={!canGoPrev}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Month A */}
              <div>
                <h4 className="text-center font-semibold mb-6 text-black text-lg lg:text-base">{formatMonthLabel(monthA[0])}</h4>
                <div className="grid grid-cols-7 text-sm lg:text-xs text-black mb-2 font-medium">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <div key={d} className="text-center">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-base lg:text-sm">
                  {monthA.map(d => {
                    const start = firstDate && d.getTime() === firstDate.getTime();
                    const end = secondDate && d.getTime() === secondDate.getTime();
                    const range = inRange(d);
                    const baseClasses = "py-2 rounded-md transition-colors";
                    const stateClasses = start || end
                      ? "bg-black text-white"
                      : range
                        ? "bg-red-900/10 text-black hover:bg-red-50 hover:text-red-600"
                        : "text-black hover:bg-red-50 hover:text-red-600";
                    return (
                      <button
                        key={d.getTime()}
                        type="button"
                        onClick={() => handleDayClick(d)}
                        onMouseEnter={() => handleDayMouseEnter(d)}
                        onMouseLeave={handleDayMouseLeave}
                        className={`${baseClasses} ${stateClasses}`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Month B (hidden on mobile) */}
              <div className="hidden md:block">
                <h4 className="text-center font-semibold mb-6 text-black text-lg lg:text-base">{formatMonthLabel(monthB[0])}</h4>
                <div className="grid grid-cols-7 text-sm lg:text-xs text-black mb-2 font-medium">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <div key={d} className="text-center">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-base lg:text-sm">
                  {monthB.map(d => {
                    const start = firstDate && d.getTime() === firstDate.getTime();
                    const end = secondDate && d.getTime() === secondDate.getTime();
                    const range = inRange(d);
                    const baseClasses = "py-2 rounded-md transition-colors";
                    const stateClasses = start || end
                      ? "bg-black text-white"
                      : range
                        ? "bg-red-900/10 text-black hover:bg-red-50 hover:text-red-600"
                        : "text-black hover:bg-red-50 hover:text-red-600";
                    return (
                      <button
                        key={d.getTime()}
                        type="button"
                        onClick={() => handleDayClick(d)}
                        onMouseEnter={() => handleDayMouseEnter(d)}
                        onMouseLeave={handleDayMouseLeave}
                        className={`${baseClasses} ${stateClasses}`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Next Arrow */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Next months"
              className="absolute -right-2 top-2 p-2 rounded-md text-black hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          {/* Side-by-side date/time sections with time controls below each */}
          <div className={`mt-8 border-t pt-5 grid ${singleMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-8`}>
            <div>
              <p className="text-base lg:text-sm text-black font-semibold mb-1">Pickup Date & Time</p>
              <h4 className="font-semibold text-black text-lg lg:text-base">{firstDate ? formatDisplay(firstDate, pickupTime) : "Select date"}</h4>
              <div className="flex items-center space-x-2 mt-3">
                <button
                  type="button"
                  className="px-3 py-2 rounded text-black hover:bg-gray-100"
                  onClick={() => {
                    const [time, meridiem] = pickupTime.split(' ');
                    let [hour, minute] = time.split(':');
                    let h = parseInt(hour, 10) - 1; if (h < 1) h = 12;
                    const newTime = `${h}:${minute} ${meridiem}`;
                    setPickupTime(newTime);
                    if (firstDate) onChange({ pickupDateTime: formatDisplay(firstDate, newTime) });
                  }}
                >–</button>
                <span className="font-semibold text-black">{pickupTime.split(' ')[0]}</span>
                <button
                  type="button"
                  className="px-3 py-2 rounded text-black hover:bg-gray-100"
                  onClick={() => {
                    const [time, meridiem] = pickupTime.split(' ');
                    let [hour, minute] = time.split(':');
                    let h = parseInt(hour, 10) + 1; if (h > 12) h = 1;
                    const newTime = `${h}:${minute} ${meridiem}`;
                    setPickupTime(newTime);
                    if (firstDate) onChange({ pickupDateTime: formatDisplay(firstDate, newTime) });
                  }}
                >+</button>
                <button
                  type="button"
                  className={`ml-3 px-4 py-2 rounded ${pickupTime.endsWith('AM') ? 'bg-black text-white' : 'text-black'}`}
                  onClick={() => {
                    if (!pickupTime.endsWith('AM')) {
                      const newTime = pickupTime.replace(/PM$/, 'AM');
                      setPickupTime(newTime);
                      if (firstDate) onChange({ pickupDateTime: formatDisplay(firstDate, newTime) });
                    }
                  }}
                >AM</button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded ${pickupTime.endsWith('PM') ? 'bg-black text-white' : 'text-black'}`}
                  onClick={() => {
                    if (!pickupTime.endsWith('PM')) {
                      const newTime = pickupTime.replace(/AM$/, 'PM');
                      setPickupTime(newTime);
                      if (firstDate) onChange({ pickupDateTime: formatDisplay(firstDate, newTime) });
                    }
                  }}
                >PM</button>
              </div>
            </div>
            {!singleMode && (
              <div>
                <p className="text-base lg:text-sm text-black font-semibold mb-1">Return Date & Time</p>
                <h4 className="font-semibold text-black text-lg lg:text-base">{secondDate ? formatDisplay(secondDate, returnTime) : selectingReturn ? 'Select return' : 'Return'}</h4>
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded text-black hover:bg-gray-100"
                    onClick={() => {
                      const [time, meridiem] = returnTime.split(' ');
                      let [hour, minute] = time.split(':');
                      let h = parseInt(hour, 10) - 1; if (h < 1) h = 12;
                      const newTime = `${h}:${minute} ${meridiem}`;
                      setReturnTime(newTime);
                      if (secondDate) onChange({ returnDateTime: formatDisplay(secondDate, newTime) });
                    }}
                  >–</button>
                  <span className="font-semibold text-black">{returnTime.split(' ')[0]}</span>
                  <button
                    type="button"
                    className="px-3 py-2 rounded text-black hover:bg-gray-100"
                    onClick={() => {
                      const [time, meridiem] = returnTime.split(' ');
                      let [hour, minute] = time.split(':');
                      let h = parseInt(hour, 10) + 1; if (h > 12) h = 1;
                      const newTime = `${h}:${minute} ${meridiem}`;
                      setReturnTime(newTime);
                      if (secondDate) onChange({ returnDateTime: formatDisplay(secondDate, newTime) });
                    }}
                  >+</button>
                  <button
                    type="button"
                    className={`ml-3 px-4 py-2 rounded ${returnTime.endsWith('AM') ? 'bg-black text-white' : 'text-black'}`}
                    onClick={() => {
                      if (!returnTime.endsWith('AM')) {
                        const newTime = returnTime.replace(/PM$/, 'AM');
                        setReturnTime(newTime);
                        if (secondDate) onChange({ returnDateTime: formatDisplay(secondDate, newTime) });
                      }
                    }}
                  >AM</button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded ${returnTime.endsWith('PM') ? 'bg-black text-white' : 'text-black'}`}
                    onClick={() => {
                      if (!returnTime.endsWith('PM')) {
                        const newTime = returnTime.replace(/AM$/, 'PM');
                        setReturnTime(newTime);
                        if (secondDate) onChange({ returnDateTime: formatDisplay(secondDate, newTime) });
                      }
                    }}
                  >PM</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Desktop close button */}
        <div className="hidden md:block absolute top-4 right-4">
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-600 hover:text-black"><X size={20} /></button>
        </div>
      </div>
    </div>
  );
}
