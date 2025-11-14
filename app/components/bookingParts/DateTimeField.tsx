"use client";

import { Calendar } from "lucide-react";
import { DateTimeFieldProps } from "../../../lib/types/ui";

export default function DateTimeField({
  id,
  label,
  value,
  placeholder = "12 Nov 2025 | 09:00 AM",
  isOpen,
  onOpen,
  showMobileLabel = true,
  show = true,
}: DateTimeFieldProps) {
  if (!show) return null;
  return (
    <div>
      {showMobileLabel && (
        <div className="lg:hidden text-base md:text-base font-medium text-black mb-1">
          {label}
        </div>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
          <Calendar size={20} />
        </span>
        <input
          id={id}
          type="text"
          value={value}
          readOnly
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={onOpen}
          onFocus={onOpen}
          placeholder={placeholder}
          className="booking-input cursor-pointer"
        />
      </div>
    </div>
  );
}
