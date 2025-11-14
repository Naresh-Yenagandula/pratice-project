"use client";
import { MonthCalendarProps } from "../../../lib/types/ui";

export function MonthCalendar({
  days,
  monthLabel,
  firstDate,
  secondDate,
  hoverDate,
  inRange,
  onDayClick,
  onDayHover,
  onDayHoverEnd,
  startOfToday,
  hideOnMobile,
}: MonthCalendarProps) {
  return (
    <div className={hideOnMobile ? "hidden md:block" : "block"}>
      <h4 className="text-center font-semibold mb-6 text-black text-lg lg:text-base">
        <span className="md:hidden">
          {days[0]
            ? days[0].toLocaleString("en", { month: "long" }) +
              " " +
              days[0].getFullYear()
            : monthLabel}
        </span>
        <span className="hidden md:inline">{monthLabel}</span>
      </h4>
      <div className="mb-2">
        <div className="grid grid-cols-7 text-sm lg:text-xs text-black font-medium md:hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-7 text-sm lg:text-xs text-black font-medium">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-base lg:text-sm">
        {days.length > 0 &&
          Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={"m-place-" + i} className="md:hidden" />
          ))}
        {days.length > 0 &&
          Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
            <div key={"d-place-" + i} className="hidden md:block" />
          ))}
        {days.map((d) => {
          const isPast = d < startOfToday;
          const start = firstDate && d.getTime() === firstDate.getTime();
          const end = secondDate && d.getTime() === secondDate.getTime();
          const range = inRange(d);
          const base = "py-2 rounded-md transition-colors";
          const state = isPast
            ? "text-gray-300 cursor-not-allowed"
            : start || end
            ? "bg-black text-white"
            : range
            ? "bg-red-900/10 text-black hover:bg-red-50 hover:text-red-600"
            : "text-black hover:bg-red-50 hover:text-red-600";
          return (
            <button
              key={d.getTime()}
              type="button"
              disabled={isPast}
              onClick={() => onDayClick(d)}
              onMouseEnter={() => onDayHover && onDayHover(d)}
              onMouseLeave={() => onDayHoverEnd && onDayHoverEnd()}
              className={`${base} ${state}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
