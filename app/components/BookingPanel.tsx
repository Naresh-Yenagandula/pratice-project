"use client";

import DateTimeDialog from "./DateTimeDialog";
import LocationPicker from "./LocationPicker";
import PromoCodeDialog from "./PromoCodeDialog";
import DeliveryDialog from "./DeliveryDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
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
            className="flex flex-col gap-1"
            onSubmit={e => {
                e.preventDefault();
                // Optional: persist to sessionStorage if you want refresh resilience
                try {
                    sessionStorage.setItem('LAST_BOOKING_DATA', JSON.stringify(dataByTab));
                } catch {}
                router.push('/results');
            }}
        >
            {/* Removed global top bar; checkbox now lives contextually */}
            {/* Header row removed checkbox per new placement requirement */}
            <div className="hidden md:grid grid-cols-5 gap-5 items-end text-xs md:text-sm lg:text-xs xl:text-sm 2xl:text-base">
                <div className={sameReturn && showReturnLocation ? 'font-medium text-black col-span-2' : 'font-medium text-black'}>Pickup {showReturnLocation ? "& Return": null} Location</div>
                {showReturnLocation && !sameReturn && <div className="font-medium text-black"></div>}
                <div className="font-medium text-black">Pickup Date & Time</div>
                {showReturnLocation && <div className="font-medium text-black">Return Date & Time</div>}
            </div>
            {/* Inputs row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3 xl:gap-4 2xl:gap-5 items-start">
                <div className={sameReturn && showReturnLocation ? 'relative lg:col-span-2' : 'relative'}>
                    {/* Mobile label with conditional checkbox when sameReturn true */}
                    <div className="md:hidden text-xs md:text-sm font-medium text-black mb-1 flex justify-between items-center">
                        <span>Pickup Location</span>
                        {showReturnLocation && sameReturn && (
                            <label className="flex items-center gap-1 text-black cursor-pointer select-none font-bold pb-2 text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-3 w-3 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        )}
                    </div>
                    {/* Desktop top-right checkbox when sameReturn true */}
                    {showReturnLocation && sameReturn && (
                        <div className="hidden md:block absolute -top-7 right-0">
                            <label className="flex items-center gap-2 text-black cursor-pointer select-none font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-4 w-4 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
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
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-base lg:text-sm xl:text-base 2xl:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm md:placeholder:text-xs lg:placeholder:text-xs xl:placeholder:text-sm placeholder:font-bold text-black"
                        />
                    </div>
                    <div className="mt-2 md:mt-3 flex flex-wrap gap-3 md:gap-5 text-xs md:text-sm font-medium items-center">
                        <button
                            type="button"
                            onClick={() => { setDeliveryTarget("pickup"); setDeliveryOpen(true); }}
                            className="flex items-center gap-2 text-red-600 md:text-black font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg"
                        >
                            <Truck size={16} className="text-red-600 md:text-black" /> <span className="font-bold">Deliver to me</span> <ChevronRight size={16} className="text-red-600 md:text-black" />
                        </button>
                    </div>
                </div>
                {showReturnLocation && !sameReturn ? (
                    <div className="relative">
                        {/* Mobile label with checkbox when not sameReturn */}
                        <div className="md:hidden text-xs md:text-sm font-medium text-black mb-1 flex justify-between items-center">
                            <span>Return Location</span>
                            <label className="md:hidden flex items-center gap-1 text-black cursor-pointer select-none font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-3 w-3 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold">Same Return Location</span>
                            </label>
                        </div>
                        {/* Desktop top-right checkbox when not sameReturn */}
                        <div className="hidden md:block absolute -top-7 right-0">
                            <label className="flex items-center gap-2 text-black cursor-pointer select-none font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg">
                                <input
                                    type="checkbox"
                                    checked={sameReturn}
                                    onChange={e => onChange(e.target.checked ? { sameReturn: true, returnLocation: pickupLocation } : { sameReturn: false })}
                                    className="h-4 w-4 rounded border-gray-300 accent-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
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
                                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-base lg:text-sm xl:text-base 2xl:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm md:placeholder:text-xs lg:placeholder:text-xs xl:placeholder:text-sm placeholder:font-bold text-black"
                            />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium items-center">
                        <button
                            type="button"
                            onClick={() => { setDeliveryTarget("returnLoc"); setDeliveryOpen(true); }}
                            className="flex items-center gap-2 text-red-600 md:text-black font-bold text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg"
                        >
                            <Truck size={16} className="text-red-600 md:text-black" /> <span className="font-bold">Collect from me</span> <ChevronRight size={16} className="text-red-600 md:text-black" /> 
                        </button>
                    </div>
                    </div>
                ) : null}
                <div>
                        <div className="md:hidden text-xs md:text-sm font-medium text-black mb-1">Pickup Date & Time</div>
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
                            className="w-full cursor-pointer rounded-md border border-gray-300 pl-10 pr-4 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-base lg:text-sm xl:text-base 2xl:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm md:placeholder:text-xs lg:placeholder:text-xs xl:placeholder:text-sm placeholder:font-bold text-black"
                        />
                    </div>
                    <div className="mt-2 text-xs hidden md:block">
                        {data.promoCode ? (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPromoOpen(true)}
                                    className="flex items-center gap-2 font-medium text-black text-[10px] md:text-xs xl:text-sm"
                                >
                                    <Ticket size={16} />
                                    <span className="font-bold underline">{data.promoCode}</span>
                                    <span className="text-xs">(Added Promo Code)</span>
                                </button>
                            <button
                                type="button"
                                onClick={() => onChange({ promoCode: "" })}
                                className="text-red-600 underline text-[10px] md:text-xs xl:text-sm ml-2"
                                aria-label="Remove promo code"
                            >
                                Remove
                            </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPromoOpen(true)}
                                className="flex items-center gap-2 font-bold text-black text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-lg"
                            >
                                <Ticket size={16} /> <span className="font-bold underline">Promo Code / Shukran Id</span>
                            </button>
                        )}
                    </div>
                </div>
                {showReturnLocation && (
                    <div>
                        <div className="md:hidden text-xs md:text-sm font-medium text-black mb-1">Return Date & Time</div>
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
                                className="w-full cursor-pointer rounded-md border border-gray-300 pl-10 pr-4 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-base lg:text-sm xl:text-base 2xl:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 placeholder:text-sm md:placeholder:text-xs lg:placeholder:text-xs xl:placeholder:text-sm placeholder:font-bold text-black"
                            />
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <button
                        type="submit"
                        className="w-full whitespace-nowrap bg-red-600 text-white rounded-md px-4 md:px-5 lg:px-5 xl:px-5 2xl:px-6 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-sm lg:text-xs xl:text-sm 2xl:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Show cars
                    </button>
                    {/* Mobile promo code block after button */}
                    <div className="md:hidden text-xs flex items-center justify-center w-full">
                        {data.promoCode ? (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPromoOpen(true)}
                                    className="flex items-center gap-2 font-medium text-black text-[10px]"
                                >
                                    <Ticket size={16} />
                                    <span className="font-bold underline">{data.promoCode}</span>
                                    <span className="text-xs">(Added Promo Code)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange({ promoCode: "" })}
                                    className="text-red-600 underline text-[10px] ml-2"
                                    aria-label="Remove promo code"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPromoOpen(true)}
                                className="flex items-center gap-2 font-bold text-black text-sm"
                            >
                                <Ticket size={16} /> <span className="font-bold underline">Promo Code / Shukran Id</span>
                            </button>
                        )}
                    </div>
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
