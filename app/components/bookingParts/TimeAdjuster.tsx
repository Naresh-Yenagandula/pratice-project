"use client";
import { TimeAdjusterProps } from "../../../lib/types/ui";

function shiftHour(time: string, delta: number): string {
  const [t, meridiemRaw] = time.split(" ");
  const [hourStr, minute] = t.split(":");
  const originalHour = parseInt(hourStr, 10);
  let meridiem = meridiemRaw;
  let newHour = originalHour + delta;

  if (delta > 0 && originalHour === 12) {
    newHour = 1;
    meridiem = meridiem === "AM" ? "PM" : "AM";
  } else if (delta < 0 && originalHour === 1) {
    newHour = 12;
    meridiem = meridiem === "AM" ? "PM" : "AM";
  } else {
    if (newHour < 1) newHour = 12; // safety for other deltas
    if (newHour > 12) newHour = 1; // safety for other deltas
  }

  return `${newHour}:${minute} ${meridiem}`;
}

function formatDateLabel(d: Date) {
  return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
}

export function TimeAdjuster({
  label,
  time,
  onChange,
  date,
}: TimeAdjusterProps) {
  const combinedLabel = date ? `${formatDateLabel(date)} | ${time}` : time;
  return (
    <div>
      <div className="flex flex-row md:flex-col mb-3">
        <p className="text-base lg:text-sm text-black mb-1 lg:mb-0 pr-2">
          <span className="block lg:hidden">{label.split(" ")[0]}</span>
          <span className="hidden lg:block">{label}</span>
        </p>
        <p className="font-semibold text-gray-700 text-lg lg:text-base truncate">
          {combinedLabel}
        </p>
      </div>
      <div className="flex items-center justify-between text-2xl md:text-base">
        {/* Hour adjusters on left */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="px-2 py-1 rounded text-black hover:bg-gray-100 lg:text-md"
            onClick={() => onChange(shiftHour(time, -1))}
            aria-label="Decrease hour"
          >
            –
          </button>
          <span className="font-semibold text-gray-700 underline min-w-[4ch] lg:text-md">
            {(() => {
              const [hour, minute] = time.split(" ")[0].split(":");
              const pad = (n: string) => n.padStart(2, "0");
              return `${pad(hour)}:${pad(minute)}`;
            })()}
          </span>
          <button
            type="button"
            className="px-2 py-1 rounded text-black hover:bg-gray-100 lg:text-md"
            onClick={() => onChange(shiftHour(time, 1))}
            aria-label="Increase hour"
          >
            +
          </button>
        </div>
        {/* AM/PM toggles on right smaller */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className={`px-2 py-1 rounded text-lg md:text-xs font-medium ${
              time.endsWith("AM")
                ? "bg-black text-white"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => {
              if (!time.endsWith("AM")) onChange(time.replace(/PM$/, "AM"));
            }}
            aria-label="Set AM"
          >
            AM
          </button>
          <button
            type="button"
            className={`px-2 py-1 rounded text-lg md:text-xs font-medium ${
              time.endsWith("PM")
                ? "bg-black text-white"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => {
              if (!time.endsWith("PM")) onChange(time.replace(/AM$/, "PM"));
            }}
            aria-label="Set PM"
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
