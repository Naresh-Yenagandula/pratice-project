"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Plane } from "lucide-react";
import { MonthCalendar } from "./bookingParts/MonthCalendar";
import { TimeAdjuster } from "./bookingParts/TimeAdjuster";
import { DateTimeDialogProps } from "../../lib/types/ui";

function formatDisplay(date: Date, timeLabel: string) {
  const day = date.getDate();
  const monthShort = date.toLocaleString("en", { month: "short" });
  return `${day} ${monthShort} ${date.getFullYear()} | ${timeLabel}`;
}

export default function DateTimeDialog({
  open,
  pickupDateTime,
  returnDateTime,
  pickupLocation,
  returnLocation,
  onChange,
  onClose,
  singleMode,
}: DateTimeDialogProps) {
  const extractTime = (val: string, fallback: string): string => {
    const parts = val.split("|");
    if (parts.length === 2) return parts[1].trim();
    return fallback;
  };
  const [pickupTime, setPickupTime] = useState(
    extractTime(pickupDateTime, "8:00 AM")
  );
  const [returnTime, setReturnTime] = useState(
    extractTime(returnDateTime, "12:00 AM")
  );
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const selectingReturn =
    !singleMode && firstDate !== null && secondDate === null;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (!dialogRef.current || dialogRef.current.contains(e.target as Node))
        return;
      onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  const [startMonth, setStartMonth] = useState<Date>(new Date(2025, 10, 1));
  const getMonthDays = (base: Date) => {
    const year = base.getFullYear();
    const month = base.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
  };
  const monthA = getMonthDays(startMonth);
  const monthB = getMonthDays(
    new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 1)
  );
  const formatMonthLabel = (d: Date) =>
    d.toLocaleString("en", { month: "short" }) + " " + d.getFullYear();
  const goNext = () =>
    setStartMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const goPrev = () =>
    setStartMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
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
      const [datePart, timePart] = pickupDateTime.split("|");
      if (timePart) setPickupTime(timePart.trim());
      const segs = datePart.trim().split(" ");
      if (segs.length === 3) {
        const [dayStr, monthStr, yearStr] = segs;
        const monthIndex = new Date(`${monthStr} 1, 2020`).getMonth();
        const d = new Date(
          parseInt(yearStr, 10),
          monthIndex,
          parseInt(dayStr, 10)
        );
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
        const d = new Date(
          parseInt(yearStr, 10),
          monthIndex,
          parseInt(dayStr, 10)
        );
        setSecondDate(d);
      }
    }
  }, [open]);

  const handleDayClick = (d: Date) => {
    if (singleMode) {
      setFirstDate(d);
      setSecondDate(null);
      setHoverDate(null);
      onChange({
        pickupDateTime: formatDisplay(d, pickupTime),
        returnDateTime: "",
      });
      return;
    }
    if (!firstDate) {
      setFirstDate(d);
      onChange({ pickupDateTime: formatDisplay(d, pickupTime) });
    } else if (!secondDate) {
      setSecondDate(d);
      onChange({ returnDateTime: formatDisplay(d, returnTime) });
    } else {
      setFirstDate(d);
      setSecondDate(null);
      setHoverDate(null);
      onChange({
        pickupDateTime: formatDisplay(d, pickupTime),
        returnDateTime: "",
      });
    }
  };
  const handleDayMouseEnter = (d: Date) => {
    if (selectingReturn) setHoverDate(d);
  };
  const handleDayMouseLeave = () => {
    if (selectingReturn) setHoverDate(null);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Date time selection"
      aria-modal="true"
      className="fixed inset-0 z-50 w-full h-screen bg-white overflow-hidden md:static md:h-auto md:w-auto md:bg-transparent md:overflow-visible"
    >
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg text-black font-semibold">
          Pickup Date & Return Date
        </h2>
        <button onClick={onClose} aria-label="Close" className="btn-icon">
          <X size={20} />
        </button>
      </div>
      <div
        ref={dialogRef}
        className="h-[calc(100vh-3.2rem)] md:h-auto md:w-[80vw] md:rounded-2xl md:shadow-xl md:border md:border-gray-200 md:bg-white flex flex-col md:flex-row md:items-stretch md:justify-start md:p-0 overflow-y-auto md:overflow-hidden mx-auto relative"
      >
        <div className="hidden md:flex flex-col basis-[40%] bg-gray-50 border-r border-gray-200 p-8 pr-6">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2">
                <Plane size={18} className="text-black" />
                <h3 className="font-semibold text-base text-black">
                  {pickupLocation || "Pickup Location"}
                </h3>
              </div>
              <p className="mt-3 text-sm text-gray-600 font-medium">
                {firstDate
                  ? formatDisplay(firstDate, pickupTime)
                  : "Select pickup date"}
              </p>
            </div>
            {!singleMode && (
              <>
                <div className="h-12 border-l ml-4 border-gray-300" />
                <div>
                  <div className="flex items-center space-x-2">
                    <Plane size={18} className="text-black" />
                    <h3 className="font-semibold text-base text-black">
                      {returnLocation || "Return Location"}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 font-medium">
                    {secondDate
                      ? formatDisplay(secondDate, returnTime)
                      : selectingReturn
                      ? "Select return date"
                      : "Return date"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="relative basis-[60%] px-4 md:px-8 py-6 md:py-8">
          <div className="flex items-start justify-between gap-6 relative mb-6">
            <button
              type="button"
              onClick={() => canGoPrev && goPrev()}
              aria-label="Previous months"
              className={`absolute left-0 -top-1 p-2 rounded-md ${
                canGoPrev
                  ? "text-black hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!canGoPrev}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <MonthCalendar
                days={monthA}
                monthLabel={formatMonthLabel(monthA[0])}
                firstDate={firstDate}
                secondDate={secondDate}
                hoverDate={hoverDate}
                inRange={inRange}
                onDayClick={handleDayClick}
                onDayHover={handleDayMouseEnter}
                onDayHoverEnd={handleDayMouseLeave}
                startOfToday={startOfToday}
              />
              <MonthCalendar
                days={monthB}
                monthLabel={formatMonthLabel(monthB[0])}
                firstDate={firstDate}
                secondDate={secondDate}
                hoverDate={hoverDate}
                inRange={inRange}
                onDayClick={handleDayClick}
                onDayHover={handleDayMouseEnter}
                onDayHoverEnd={handleDayMouseLeave}
                startOfToday={startOfToday}
                hideOnMobile
              />
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next months"
              className="absolute right-0 -top-1 p-2 rounded-md text-black hover:bg-gray-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          {firstDate && !singleMode && (
            <div
              className="hidden md:flex my-4 items-center justify-center"
              aria-live="polite"
            >
              <div className="border border-gray-200 rounded-md px-4 py-2 flex items-center space-x-3 bg-white">
                <span className="text-sm font-medium text-black">
                  {(() => {
                    const endRef =
                      secondDate || (selectingReturn && hoverDate) || firstDate;
                    const msPerDay = 86400000;
                    const diff =
                      Math.round(
                        (endRef.getTime() - firstDate.getTime()) / msPerDay
                      ) + 1;
                    if (diff <= 1) return "1 day";
                    return (
                      `${diff} days` +
                      (selectingReturn && !secondDate ? " (preview)" : "")
                    );
                  })()}
                </span>
              </div>
            </div>
          )}
          <div
            className={`md:mt-4 md:pt-4 md:border-t md:grid ${
              singleMode ? "md:grid-cols-1" : "md:grid-cols-2"
            } md:gap-10 md:pb-10
            fixed md:static bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4 pb-6 px-4 space-y-4 md:space-y-0`}
          >
            <div className="md:pr-8 md:border-gray-200">
              <TimeAdjuster
                label="Pickup Date & Time"
                time={pickupTime}
                date={firstDate}
                onChange={(newTime) => {
                  setPickupTime(newTime);
                  if (firstDate)
                    onChange({
                      pickupDateTime: formatDisplay(firstDate, newTime),
                    });
                }}
              />
            </div>
            {!singleMode && (
              <div className="md:pl-2 md:pt-0 border-t md:border-t-0 border-gray-200 pt-4">
                <TimeAdjuster
                  label="Return Date & Time"
                  time={returnTime}
                  date={secondDate}
                  onChange={(newTime) => {
                    setReturnTime(newTime);
                    if (secondDate)
                      onChange({
                        returnDateTime: formatDisplay(secondDate, newTime),
                      });
                  }}
                />
              </div>
            )}
            <button
              type="button"
              className="md:hidden w-full btn-primary px-3 py-3 md:py-2 text-base md:text-sm"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
