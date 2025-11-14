"use client";

import { CheckCircle2, Ticket } from "lucide-react";

interface PromoCodeLinkProps {
  promoCode?: string;
  onAdd: () => void;
  onRemove: () => void;
  variant: "desktop" | "mobile"; // styling differences
}

export default function PromoCodeLink({
  promoCode,
  onAdd,
  onRemove,
  variant,
}: PromoCodeLinkProps) {
  const isDesktop = variant === "desktop";
  if (isDesktop) {
    return (
      <div className="hidden md:block mt-3 text-[11px] md:text-xs xl:text-sm">
        {promoCode ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-2 font-medium text-black text-[11px] md:text-xs xl:text-sm"
            >
              <Ticket size={14} className="md:hidden" />
              <Ticket size={16} className="hidden md:block" />
              <span className="font-bold underline">{promoCode}</span>
              <span className="text-xs">(Added Promo Code)</span>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-red-600 underline text-[11px] md:text-xs xl:text-sm ml-2"
              aria-label="Remove promo code"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 font-bold text-black text-[11px] md:text-xs lg:text-sm xl:text-sm 2xl:text-base"
          >
            <Ticket size={14} className="md:hidden" />
            <Ticket size={16} className="hidden md:block" />
            <span className="font-bold underline">Promo Code / Shukran Id</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="md:hidden flex items-center justify-center w-full text-base">
      {promoCode ? (
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-red-600" />
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 font-medium text-black text-base"
          >
            <Ticket size={20} />
            <span className="font-bold underline">{promoCode}</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 underline text-base ml-2"
            aria-label="Remove promo code"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 font-bold text-black text-base"
        >
          <Ticket size={20} />{" "}
          <span className="font-bold underline">Promo Code / Shukran Id</span>
        </button>
      )}
    </div>
  );
}
