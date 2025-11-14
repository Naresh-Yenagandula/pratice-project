"use client";
import { MapPin, X } from "lucide-react";
import { MobileHeaderProps } from "../../../lib/types/ui";

export function MobileHeader({
  field,
  query,
  setQuery,
  inputRef,
  onClose,
}: MobileHeaderProps) {
  return (
    <div className="md:hidden flex flex-col gap-3 px-4 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-black">
          Select {field === "pickup" ? "Pickup Location" : "Return Location"}
        </h2>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
          <MapPin size={18} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location"
          className="input-with-icon pl-10 pr-10 py-2 text-sm w-full"
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon"
          tabIndex={-1}
          type="button"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
