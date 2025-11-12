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
            <div className="w-full px-4 sm:px-10 lg:px-32">
                <div
                    role="tablist"
                    aria-label="Booking options"
                    className="flex border-b border-gray-100 p-0 m-0"
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
                                    px-5 py-6 text-2xl border-b-2
                                    ${isActive
                                        ? "border-red-600 text-red-600 font-bold"
                                        : "border-transparent text-gray-500"
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
                <div className="pt-8 flex justify-center">
                    <div
                        role="tabpanel"
                        id={`panel-${activeTab}`}
                        aria-labelledby={activeTab}
                    >
                        <BookingPanel tabKey={activeTab} data={currentData} onChange={updateData} />
                    </div>
                </div>
            </div>
        </section>
    );
}


