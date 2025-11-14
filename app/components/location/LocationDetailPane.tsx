"use client";
import { LocationDetailPaneProps } from "../../../lib/types/ui";
import { Building2 } from "lucide-react";

export function LocationDetailPane({ detail }: LocationDetailPaneProps) {
  return (
    <div
      className="hidden md:flex flex-1 flex-col"
      style={{ backgroundColor: "#f5f3f3" }}
    >
      <div className="p-5 h-full flex flex-col">
        <h3 className="text-xl font-semibold text-black mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5" /> {detail?.name}
        </h3>
        {detail?.address && (
          <div className="mb-3 flex items-start gap-2 text-base text-black">
            <span>{detail.address}</span>
          </div>
        )}
        <p className="text-base text-black mb-4 font-medium">
          {detail?.hours || "Sunday-Saturday : 08:00-22:00"}
        </p>
        {detail?.message && (
          <div className="mb-3 flex items-start gap-2 text-sm text-red-500">
            <span>{detail.message}</span>
          </div>
        )}
        {detail?.googleLocationURL ? (
          <div className="flex-1">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              className="h-full w-full rounded-md"
              style={{ minHeight: 200, border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={detail.googleLocationURL}
            />
          </div>
        ) : (
          <div className="flex-1">
            <div className="h-full w-full rounded-md bg-gray-100 flex items-center justify-center text-black text-sm font-medium">
              Map unavailable
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
