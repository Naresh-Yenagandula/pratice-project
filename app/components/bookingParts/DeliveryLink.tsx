"use client";

import { Truck, ChevronRight } from "lucide-react";
import { DeliveryLinkProps } from "../../../lib/types/ui";

export default function DeliveryLink({ variant, onClick }: DeliveryLinkProps) {
  const isPickup = variant === "pickup";
  const text = isPickup ? "Deliver to me" : "Collect from me";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-red-600 md:text-black font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-md cursor-pointer "
    >
      <Truck size={16} className="text-red-600 md:text-black" />
      <span className="font-bold">{text}</span>
      <ChevronRight size={16} className="text-red-600 md:text-black" />
    </button>
  );
}
