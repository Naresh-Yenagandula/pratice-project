"use client";

import BookingPanel from "./BookingPanel";
import { useBooking } from "./BookingContext";

interface TabConfig {
    key: string;
    label: string;
}

export default function BookingTab() {

    const { activeTab, setActiveTab, dataByTab, updateTabData } = useBooking();

    const tabs: TabConfig[] = [
        { key: "start", label: "Start Booking" },
        { key: "monthly", label: "Monthly Subscription" },
    ];

    const currentData = dataByTab[activeTab];
    const updateData = (patch: Partial<typeof currentData>) => updateTabData(activeTab, patch);

    return (
        <section>
            <div className="w-full px-3 sm:px-6 lg:px-20 xl:px-28 2xl:px-32 max-w-[1600px] mx-auto">
                <div
                    role="tablist"
                    aria-label="Booking options"
                    className="flex border-b border-gray-100 p-0 m-0 overflow-x-auto scrollbar-hide"
                    style={{ lineHeight: 1 }}
                >
                    {tabs.map(t => {
                        const isActive = t.key === activeTab;
                        return (
                            <button
                                key={t.key}
                                role="tab"
                                id={t.key}
                                aria-selected={isActive}
                                aria-controls={t.key}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setActiveTab(t.key)}
                                className={`
                                    whitespace-nowrap px-4 py-3 text-base sm:text-lg md:text-xl xl:text-2xl 2xl:text-[32px] md:px-5 md:py-5 xl:py-6 border-b-2 transition-colors
                                    ${isActive
                                        ? "border-red-600 text-red-600 font-bold"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }
                                `}
                                style={{
                                    margin: 0,
                                    borderRadius: 0,
                                }}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
                <div className="pt-6 sm:pt-8 flex justify-center">
                    <div
                        role="tabpanel"
                        id={`panel-${activeTab}`}
                        aria-labelledby={activeTab}
                        className="w-full"
                    >
                        <BookingPanel tabKey={activeTab} data={currentData} onChange={updateData} />
                    </div>
                </div>
            </div>
        </section>
    );
}


