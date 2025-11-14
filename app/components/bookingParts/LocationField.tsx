"use client";

import { MapPin } from "lucide-react";
import { LocationFieldProps } from "../../../lib/types/ui";

export default function LocationField({
  id,
  field,
  label,
  value,
  placeholder = "Airport, City or Address",
  isOpen,
  onOpen,
  onChange,
  sameReturn = false,
  showReturnLocation = true,
  showCheckbox = false,
  onToggleSameReturn,
  actionButton,
  wrapperClassName = "",
}: LocationFieldProps) {
  const inputId = `${field}-${id}`;

  return (
    <div
      className={wrapperClassName ? `relative ${wrapperClassName}` : "relative"}
    >
      <div className="lg:hidden text-xs md:text-sm font-medium text-black mb-1 flex justify-between items-center">
        <span className="text-base">{label}</span>
        {showReturnLocation && showCheckbox && (
          <label className="flex items-center gap-1 text-black cursor-pointer select-none font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg">
            <input
              type="checkbox"
              checked={sameReturn}
              onChange={(e) =>
                onToggleSameReturn && onToggleSameReturn(e.target.checked)
              }
              className="h-3 w-3 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
            />
            <span className="font-bold">Same Return Location</span>
          </label>
        )}
      </div>
      {showReturnLocation && showCheckbox && (
        <div className="hidden lg:block absolute -top-7 right-0">
          <label className="flex items-center gap-2 text-black cursor-pointer select-none font-bold text-sm md:text-xs lg:text-xs xl:text-sm 2xl:text-md">
            <input
              type="checkbox"
              checked={sameReturn}
              onChange={(e) =>
                onToggleSameReturn && onToggleSameReturn(e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
            />
            <span className="font-bold">Same Return Location</span>
          </label>
        </div>
      )}
      <div className="relative">
        {/* Explicit accessible label for the input (desktop) */}
        <label htmlFor={inputId} className="sr-only">{label}</label>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
          <MapPin size={20} />
        </span>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onOpen}
          onClick={(e) => {
            (e.target as HTMLInputElement).setAttribute("autocomplete", "off");
            onOpen();
          }}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-autocomplete="none"
          aria-label={label}
          placeholder={placeholder}
          className="booking-input"
          autoComplete="off"
        />
      </div>
      {actionButton && (
        <div
          className={
            field === "returnLoc"
              ? "mt-3 flex flex-wrap gap-6 text-sm font-medium items-center"
              : "mt-2 md:mt-3 flex flex-wrap gap-3 md:gap-5 text-xs md:text-sm font-medium items-center"
          }
        >
          {actionButton}
        </div>
      )}
    </div>
  );
}
