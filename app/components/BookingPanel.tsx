"use client";

import DateTimeDialog from "./DateTimeDialog";
import LocationPicker from "./LocationPicker";
import PromoCodeDialog from "./PromoCodeDialog";
import DeliveryDialog from "./DeliveryDialog";
import { useState } from "react";
import { useBooking } from "./BookingContext";
import { MapPin, Calendar, Truck, Ticket, ArrowLeft, ChevronRight } from "lucide-react";

export interface BookingData {
    pickupLocation: string;
    returnLocation: string;
    sameReturn: boolean;
    pickupDateTime: string;
    returnDateTime: string;
    promoCode?: string;
}

interface BookingPanelProps {
    tabKey: string;
    data: BookingData;
    onChange: (patch: Partial<BookingData>) => void;
}

export default function BookingPanel({ tabKey, data, onChange }: BookingPanelProps) {
    const { dataByTab } = useBooking();
    const { pickupLocation, returnLocation, sameReturn, pickupDateTime, returnDateTime } = data;
    const showReturnLocation = tabKey !== "monthly";
    const [openField, setOpenField] = useState<null | "pickup" | "returnLoc">(null);
    const handleOpen = (field: "pickup" | "returnLoc") => setOpenField(field);
    const closePicker = () => setOpenField(null);

    const [openDateField, setOpenDateField] = useState<null | "pickup" | "return">(null);
    const [promoOpen, setPromoOpen] = useState(false);
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const [deliveryTarget, setDeliveryTarget] = useState<"pickup" | "returnLoc">("pickup");

    const handleLocChange = (field: "pickup" | "returnLoc", value: string) => {
        if (field === "pickup" && sameReturn) {
            onChange({ pickupLocation: value, returnLocation: value });
        } else if (field === "pickup") {
            onChange({ pickupLocation: value });
        } else {
            onChange({ returnLocation: value });
        }
    };

    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={e => {
                e.preventDefault();
                // Log all booking data across tabs
                console.log("ALL_BOOKING_DATA", JSON.parse(JSON.stringify(dataByTab)));
            }}
        >
            {/* Removed global top bar; checkbox now lives contextually */}
            {/* Header row removed checkbox per new placement requirement */}
            <div className="hidden md:grid grid-cols-12 gap-3 items-end text-lg">
                <div className={(sameReturn || !showReturnLocation ? "col-span-4" : "col-span-2") + " text-lg font-medium text-black"}>Pickup {showReturnLocation? "& Return":""} Location </div>
                {showReturnLocation && !sameReturn && (
                    <div className="col-span-2 text-lg font-medium text-black"></div>
                )}
                <div className="col-span-2 text-lg font-medium text-black">Pickup Date & Time</div>
                {showReturnLocation ? (
                    <div className="col-span-2 text-lg font-medium text-black">Return Date & Time</div>
                ) : (
                    <div className="col-span-2" />
                )}
                <div className="col-span-2" />
            </div>
            {/* Inputs row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className={(sameReturn || !showReturnLocation ? "md:col-span-4" : "md:col-span-2") + " relative"}>
                    {/* Mobile label with conditional checkbox when sameReturn true */}
                    <div className="md:hidden text-lg font-medium text-black mb-2 flex justify-between items-center">
                        <span>Pickup Location</span>
                        {showReturnLocation && sameReturn && (
                            <label className="flex items-center gap-1 text-sm text-black cursor-pointer select-none font-bold">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-3 w-3 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        )}
                    </div>
                    {/* Desktop top-right checkbox when sameReturn true */}
                    {showReturnLocation && sameReturn && (
                        <div className="hidden md:block absolute -top-7 right-0">
                            <label className="flex items-center gap-2 text-sm text-black cursor-pointer select-none text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        </div>
                    )}
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
                            <MapPin size={20} />
                        </span>
                        <input
                            id={`pickup-${tabKey}`}
                            type="text"
                            value={pickupLocation}
                            onChange={e => handleLocChange("pickup", e.target.value)}
                            onFocus={() => handleOpen("pickup")}
                            onClick={() => handleOpen("pickup")}
                            aria-haspopup="dialog"
                            aria-expanded={openField === "pickup"}
                            placeholder="Airport, City or Address"
                            className="w-full rounded-md border border-gray-300 pl-11 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm placeholder:font-bold text-black"
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium items-center">
                        <button
                            type="button"
                            onClick={() => { setDeliveryTarget("pickup"); setDeliveryOpen(true); }}
                            className="flex items-center gap-2 text-black text-lg font-bold"
                        >
                            <Truck size={16} /> <span className="font-bold">Deliver to me</span> <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                {showReturnLocation && !sameReturn && (
                    <div className="md:col-span-2 relative">
                        {/* Mobile label with checkbox when not sameReturn */}
                        <div className="md:hidden text-lg font-medium text-black mb-2 flex justify-between items-center">
                            <span>Return Location</span>
                            <label className="flex items-center gap-1 text-sm text-black cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-3 w-3 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        </div>
                        {/* Desktop top-right checkbox when not sameReturn */}
                        <div className="hidden md:block absolute -top-7 right-0">
                            <label className="flex items-center gap-2 text-sm text-black cursor-pointer select-none text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        </div>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                <MapPin size={20} />
                            </span>
                            <input
                                id={`return-${tabKey}`}
                                type="text"
                                value={returnLocation}
                                onChange={e => handleLocChange("returnLoc", e.target.value)}
                                onFocus={() => handleOpen("returnLoc")}
                                onClick={() => handleOpen("returnLoc")}
                                aria-haspopup="dialog"
                                aria-expanded={openField === "returnLoc"}
                                placeholder="Airport, City or Address"
                                className="w-full rounded-md border border-gray-300 pl-11 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm placeholder:font-bold text-black"
                            />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium items-center">
                        <button
                            type="button"
                            onClick={() => { setDeliveryTarget("returnLoc"); setDeliveryOpen(true); }}
                            className="flex items-center gap-2 text-black text-lg font-bold"
                        >
                            <Truck size={16} /> <span className="font-bold">Collect from me</span> <ChevronRight size={16} /> 
                        </button>
                    </div>
                    </div>
                )}
                <div className="md:col-span-2">
                    <div className="md:hidden text-lg font-medium text-black mb-2">Pickup Date & Time</div>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
                            <Calendar size={20} />
                        </span>
                        <input
                            id={`pickup-dt-${tabKey}`}
                            type="text"
                            value={pickupDateTime}
                            readOnly
                            aria-haspopup="dialog"
                            aria-expanded={openDateField === "pickup"}
                            onClick={() => setOpenDateField("pickup")}
                            onFocus={() => setOpenDateField("pickup")}
                            placeholder="12 Nov 2025 | 09:00 AM"
                            className="w-full cursor-pointer rounded-md border border-gray-300 pl-11 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm placeholder:font-bold text-black"
                        />
                    </div>
                    <div className="mt-2 text-xs">
                        {data.promoCode ? (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPromoOpen(true)}
                                    className="flex items-center gap-2 font-medium text-black text-base"
                                >
                                    <Ticket size={16} />
                                    <span className="font-bold underline">{data.promoCode}</span>
                                    <span className="text-xs">(Added Promo Code)</span>
                                </button>
                            <button
                                type="button"
                                onClick={() => onChange({ promoCode: "" })}
                                className="text-red-600 underline text-base ml-2"
                                aria-label="Remove promo code"
                            >
                                Remove
                            </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPromoOpen(true)}
                                className="flex items-center gap-2 font-medium text-black text-lg"
                            >
                                <Ticket size={16} /> <span className="font-bold underline">Promo Code / Shukran Id</span>
                            </button>
                        )}
                    </div>
                </div>
                {showReturnLocation && (
                    <div className="md:col-span-2">
                        <div className="md:hidden text-lg font-medium text-black mb-2">Return Date & Time</div>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                <Calendar size={20} />
                            </span>
                            <input
                                id={`return-dt-${tabKey}`}
                                type="text"
                                value={returnDateTime}
                                readOnly
                                aria-haspopup="dialog"
                                aria-expanded={openDateField === "return"}
                                onClick={() => setOpenDateField("return")}
                                onFocus={() => setOpenDateField("return")}
                                placeholder="13 Nov 2025 | 09:00 AM"
                                className="w-full cursor-pointer rounded-md border border-gray-300 pl-11 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm placeholder:font-bold text-black"
                            />
                        </div>
                    </div>
                )}
                <div className="md:col-span-1 flex">
                    <button
                        type="submit"
                        className="w-full whitespace-nowrap bg-red-600 text-white rounded-md px-7 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Show cars
                    </button>
                </div>
            </div>
            {openField && (
                <div className="relative mt-2">
                    <div className="absolute z-50" role="presentation left-0">
                        <LocationPicker
                            field={openField}
                            onSelect={(val, field) => handleLocChange(field, val)}
                            onClose={closePicker}
                        />
                    </div>
                </div>
            )}

            {openDateField && (
                <DateTimeDialog
                    open={true}
                    pickupDateTime={pickupDateTime}
                    returnDateTime={returnDateTime}
                    pickupLocation={pickupLocation}
                    returnLocation={returnLocation}
                    onChange={(patch) => onChange(patch)}
                    onClose={() => setOpenDateField(null)}
                    singleMode={tabKey === 'monthly'}
                />
            )}
            {deliveryOpen && (
                <DeliveryDialog
                    open={deliveryOpen}
                    onClose={() => setDeliveryOpen(false)}
                    onBack={() => { setDeliveryOpen(false); handleOpen(deliveryTarget); }}
                    target={deliveryTarget}
                />
            )}
            {promoOpen && (
                <PromoCodeDialog
                    open={promoOpen}
                    onClose={() => setPromoOpen(false)}
                />
            )}
        </form>
    );
}
