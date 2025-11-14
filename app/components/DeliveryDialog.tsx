"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Truck, X, Check, ChevronRight } from "lucide-react";

import { useBooking } from "./BookingContext";
import {
  useDeliveryStates,
  fetchBranchIdsByStateCode,
} from "../../lib/api/delivery";
import { fetchBranchReadiness } from "../../lib/api/branches";
import { formatDubaiDateTime } from "../../lib/utils/date";
import { DeliveryDialogProps } from "../../lib/types/ui";

export default function DeliveryDialog({
  open,
  onClose,
  onBack,
  target,
}: DeliveryDialogProps) {
  const { activeTab, dataByTab, updateTabData } = useBooking();
  const {
    states,
    loading: statesLoading,
    error: statesError,
  } = useDeliveryStates();
  const sameReturn = dataByTab[activeTab]?.sameReturn;
  const [stateCode, setStateCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<"city" | "address">("city");
  const ref = useRef<HTMLDivElement | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);

  // Build full address string
  const buildFullAddress = () =>
    `${stateName}${stateName && address ? ", " : ""}${address}`.trim();

  // Apply booking data patch based on target and sameReturn flag
  const applyLocationPatch = (full: string) => {
    const stateObj = states.find((s) => s.code === stateCode);
    if (target === "pickup") {
      const patch: any = {
        pickupLocation: full,
        pickupMode: "deliver",
        deliveryStateName: stateName,
        deliveryStateCode: stateObj?.code || "",
        deliveryAddress: address,
      };
      if (sameReturn) {
        patch.returnLocation = full;
        patch.returnMode = "deliver";
      }
      updateTabData(activeTab, patch);
    } else {
      updateTabData(activeTab, {
        returnLocation: full,
        returnMode: "collect",
        collectStateName: stateName,
        collectStateCode: stateObj?.code || "",
        collectAddress: address,
      });
    }
  };

  // Fetch readiness and update date-times
  const applyReadinessPatch = async () => {
    if (!branchId) return;
    try {
      const readiness = await fetchBranchReadiness(
        branchId,
        target === "pickup"
      );
      const pickupDT = formatDubaiDateTime(readiness.PickupOn);
      const returnDT = formatDubaiDateTime(readiness.ReturnOn);
      if (target === "pickup") {
        updateTabData(activeTab, {
          pickupDateTime: pickupDT,
          returnDateTime: returnDT,
        });
      } else {
        updateTabData(activeTab, {
          pickupDateTime: dataByTab[activeTab].pickupDateTime,
          returnDateTime: returnDT,
        });
      }
    } catch {
      // Silently ignore readiness failure per original implementation
    }
  };

  // Unified submit handler (mobile Continue & desktop Submit)
  const handleSubmit = async () => {
    const full = buildFullAddress();
    applyLocationPatch(full);
    await applyReadinessPatch();
    onClose();
  };

  useEffect(() => {
    if (!stateCode) {
      setBranchId(null);
      return;
    }
    const st = states.find((s) => s.code === stateCode);
    if (!st) {
      setBranchId(null);
      return;
    }
    let mounted = true;
    setBranchLoading(true);
    setBranchError(null);
    fetchBranchIdsByStateCode(st.code)
      .then((ids) => {
        if (mounted) setBranchId(ids[0] || null);
      })
      .catch((e) => {
        if (mounted) {
          setBranchError(e.message || "Failed to fetch branch ID");
          setBranchId(null);
        }
      })
      .finally(() => {
        if (mounted) setBranchLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [stateCode, states]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={target === "pickup" ? "Deliver to me" : "Collect from me"}
      aria-modal="true"
      className="fixed inset-0 z-50 w-full h-screen bg-white text-sm overflow-hidden px-0 py-0 md:static md:h-auto md:w-auto md:px-8 md:py-4"
    >
      <div
        ref={ref}
        className="w-full h-full md:h-auto bg-white rounded-none shadow-none md:shadow-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b flex items-center gap-4">
          <div className="flex md:hidden items-center w-full px-4 py-3">
            <button
              aria-label="Back"
              onClick={() => {
                if (step === "address") {
                  setStep("city");
                  return;
                }
                onBack();
              }}
              className="p-2 rounded hover:bg-gray-100 text-black"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col ml-2 flex-1">
              <span className="text-base font-semibold text-black mb-0.5">
                {target === "pickup" ? "Deliver to me" : "Collect from me"}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-auto p-2 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>
          <div className="hidden md:flex items-center w-full px-6 py-2">
            <button
              onClick={() => {
                if (step === "address") {
                  setStep("city");
                  return;
                }
                onBack();
              }}
              className="btn-secondary px-4 py-2 flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-3 ml-4">
              <Truck size={22} />{" "}
              {target === "pickup" ? "Deliver to me" : "Collect from me"}
            </h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="md:hidden flex items-center justify-center gap-1 text-sm py-3 md:text-base">
            <span className={step === "city" ? "text-black font-semibold" : "text-gray-400"}>
              Choose City
            </span>
            <span>
              <ChevronRight />
            </span>
            <span
              className={step === "address" ? "text-black font-semibold" : "text-gray-400"}
            >
              Your Address / Location
            </span>
          </div>
          <div className="md:hidden h-full flex flex-col px-4 py-4">
            {step === "city" && (
              <>
                {statesLoading && (
                  <div className="px-2 py-2 text-xs text-gray-500">
                    Loading cities...
                  </div>
                )}
                {statesError && (
                  <div className="px-2 py-2 text-xs text-red-600">
                    {statesError}
                  </div>
                )}
                {!statesLoading && !statesError && (
                  <ul className="mt-4 space-y-3">
                    {states.map((s) => (
                      <li key={s.code || s.name}>
                        <button
                          type="button"
                          onClick={() => {
                            setStateCode(s.code);
                            setStateName(s.name);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-md border transition text-sm font-medium ${
                            stateCode === s.code
                              ? "border-red-600 bg-red-50 text-black"
                              : "border-gray-200 bg-white text-black hover:border-red-500"
                          } `}
                        >
                          <span>{s.name}</span>
                          {stateCode === s.code ? (
                            <span className="w-4 h-4 rounded border border-red-600 bg-red-600 flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded border border-gray-300 bg-white" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-6 space-y-2">
                  {branchError && (
                    <div className="text-xs text-red-600">{branchError}</div>
                  )}
                  <button
                    type="button"
                    disabled={!stateCode || branchLoading || !branchId}
                    onClick={() => setStep("address")}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-md py-3 text-base"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === "address" && (
              <>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Write down your address here"
                  className="input-base text-base sm:text-lg px-4 py-4 h-32 resize-y"
                  rows={10}
                />
                <div className="mt-auto pt-6 space-y-2">
                  {branchLoading && (
                    <div className="text-xs text-gray-500">
                      Fetching branch...
                    </div>
                  )}
                  {branchError && (
                    <div className="text-xs text-red-600">{branchError}</div>
                  )}
                  <button
                    type="button"
                    disabled={!address}
                    onClick={handleSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-md py-3 text-base"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:block px-6 py-4">
            <div className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5">
                <label className="block text-base font-semibold text-black mb-2">
                  City
                </label>
                <div className="relative">
                  <select
                    value={stateCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setStateCode(code);
                      const st = states.find((s) => s.code === code);
                      setStateName(st?.name || "");
                    }}
                    className="select-base"
                  >
                    <option value="" className="text-gray-400 bg-gray-50">
                      Choose City
                    </option>
                    {statesLoading && (
                      <option value="" disabled>
                        Loading...
                      </option>
                    )}
                    {statesError && (
                      <option value="" disabled>
                        Error loading cities
                      </option>
                    )}
                    {!statesLoading &&
                      !statesError &&
                      states.map((s) => (
                        <option
                          key={s.code || s.name}
                          value={s.code}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          {s.name}
                        </option>
                      ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black text-lg">
                    ▾
                  </span>
                </div>
              </div>
              <div className="md:col-span-5">
                <label className="block text-base font-semibold text-black mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Write down your address here"
                  className="input-base"
                />
              </div>
              <div className="md:col-span-2 flex items-start">
                <button
                  type="button"
                  disabled={!stateCode && !address}
                  onClick={handleSubmit}
                  className="w-full btn-primary px-1 py-3 text-base font-semibold mt-8"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
