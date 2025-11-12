"use client";

import { useBooking } from "../components/BookingContext";
import Link from "next/link";

export default function ResultsPage() {
  const { dataByTab, activeTab } = useBooking();
  const data = dataByTab[activeTab];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Booking Summary</h1>
        <Link href="/" className="text-red-600 underline font-medium">Edit Search</Link>
      </header>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4 md:p-6 bg-white shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-4 capitalize">{activeTab} Booking</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm md:text-base">
            <div>
              <dt className="font-medium text-gray-500">Pickup Location</dt>
              <dd className="font-bold text-black break-words">{data.pickupLocation || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Return Location</dt>
              <dd className="font-bold text-black break-words">{data.returnLocation || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Same Return Location</dt>
              <dd className="font-bold text-black">{data.sameReturn ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Pickup Date & Time</dt>
              <dd className="font-bold text-black">{data.pickupDateTime || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Return Date & Time</dt>
              <dd className="font-bold text-black">{data.returnDateTime || '—'}</dd>
            </div>
            {data.promoCode && (
              <div>
                <dt className="font-medium text-gray-500">Promo / Shukran</dt>
                <dd className="font-bold text-black">{data.promoCode}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
