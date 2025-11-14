"use client";

import dynamic from "next/dynamic";
const DateTimeDialog = dynamic(() => import("./DateTimeDialog"), {
  ssr: false,
});
const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
});
const PromoCodeDialog = dynamic(() => import("./PromoCodeDialog"), {
  ssr: false,
});
const DeliveryDialog = dynamic(() => import("./DeliveryDialog"), {
  ssr: false,
});
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "./BookingContext";
import { validateBooking } from "../../lib/api/bookingValidation";
import { BookingPanelProps } from "../../lib/types/ui";
import { ValidateResponse } from "../../lib/types/bookingValidation";
import { composeLocationPatch } from "../../lib/utils/bookingData";
import LocationField from "./bookingParts/LocationField";
import DateTimeField from "./bookingParts/DateTimeField";
import PromoCodeLink from "./bookingParts/PromoCodeLink";
import DeliveryLink from "./bookingParts/DeliveryLink";

export default function BookingPanel({
  tabKey,
  data,
  onChange,
}: BookingPanelProps) {
  const router = useRouter();
  const { dataByTab } = useBooking();
  const {
    pickupLocation,
    returnLocation,
    sameReturn,
    pickupDateTime,
    returnDateTime,
  } = data;
  const showReturnLocation = tabKey !== "monthly";
  const [openField, setOpenField] = useState<null | "pickup" | "returnLoc">(
    null
  );
  const handleOpen = (field: "pickup" | "returnLoc") => setOpenField(field);
  const closePicker = () => setOpenField(null);

  const [openDateField, setOpenDateField] = useState<
    null | "pickup" | "return"
  >(null);
  const [promoOpen, setPromoOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliveryTarget, setDeliveryTarget] = useState<"pickup" | "returnLoc">(
    "pickup"
  );

  const handleLocChange = (
    field: "pickup" | "returnLoc",
    value: string,
    meta?: {
      branchId?: string;
      stateCode?: string;
      stateName?: string;
      address?: string;
    }
  ) => {
    onChange(composeLocationPatch(field, value, sameReturn, meta));
  };

  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [showValidateModal, setShowValidateModal] = useState(false);

  async function callValidateAPI(): Promise<ValidateResponse> {
    setValidationMessage(null);
    const res = await validateBooking(tabKey, data);
    return res;
  }

  return (
    <form
      className="flex flex-col gap-1 "
      onSubmit={async (e) => {
        e.preventDefault();
        if (submitLoading) return;
        setSubmitLoading(true);
        const result = await callValidateAPI();
        setSubmitLoading(false);
        if (!result.success) return;
        if (!result.isPassed) {
          setValidationMessage(result.message || "Validation failed");
          setShowValidateModal(true);
          return;
        }

        try {
          sessionStorage.setItem(
            "LAST_BOOKING_DATA",
            JSON.stringify(dataByTab)
          );
        } catch {}
        router.push("/results");
      }}
    >
      <div className="hidden lg:grid grid-cols-5 gap-5 items-end text-xs md:text-sm lg:text-md xl:text-sm 2xl:text-base">
        <div
          className={
            sameReturn && showReturnLocation
              ? "font-medium text-black col-span-2"
              : "font-medium text-black"
          }
        >
          Pickup {showReturnLocation ? "& Return" : null} Location
        </div>
        {showReturnLocation && !sameReturn && (
          <div className="font-medium text-black"></div>
        )}
        <div className="font-medium text-black">Pickup Date & Time</div>
        {showReturnLocation && (
          <div className="font-medium text-black">Return Date & Time</div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-3 xl:gap-4 2xl:gap-5 items-start">
        <LocationField
          id={tabKey}
          field="pickup"
          label="Pickup Location"
          value={pickupLocation}
          isOpen={openField === "pickup"}
          onOpen={() => handleOpen("pickup")}
          onChange={(val) => handleLocChange("pickup", val)}
          sameReturn={sameReturn}
          showReturnLocation={showReturnLocation}
          showCheckbox={showReturnLocation && sameReturn}
          onToggleSameReturn={(checked) =>
            onChange(
              checked
                ? { sameReturn: true, returnLocation: "" }
                : { sameReturn: false, returnLocation: "" }
            )
          }
          wrapperClassName={
            sameReturn && showReturnLocation ? "lg:col-span-2" : ""
          }
          actionButton={
            showReturnLocation ? (
              <DeliveryLink
                variant="pickup"
                onClick={() => {
                  setDeliveryTarget("pickup");
                  setDeliveryOpen(true);
                }}
              />
            ) : undefined
          }
        />
        {showReturnLocation && !sameReturn && (
          <LocationField
            id={tabKey}
            field="returnLoc"
            label="Return Location"
            value={returnLocation}
            isOpen={openField === "returnLoc"}
            onOpen={() => handleOpen("returnLoc")}
            onChange={(val) => handleLocChange("returnLoc", val)}
            sameReturn={sameReturn}
            showReturnLocation={showReturnLocation}
            showCheckbox={true}
            onToggleSameReturn={(checked) =>
              onChange(
                checked
                  ? { sameReturn: true, returnLocation: "" }
                  : { sameReturn: false, returnLocation: "" }
              )
            }
            actionButton={
              <DeliveryLink
                variant="returnLoc"
                onClick={() => {
                  setDeliveryTarget("returnLoc");
                  setDeliveryOpen(true);
                }}
              />
            }
          />
        )}
        <div>
          <DateTimeField
            id={`pickup-dt-${tabKey}`}
            label="Pickup Date & Time"
            value={pickupDateTime}
            isOpen={openDateField === "pickup"}
            onOpen={() => setOpenDateField("pickup")}
          />
          <PromoCodeLink
            variant="desktop"
            promoCode={data.promoCode}
            onAdd={() => setPromoOpen(true)}
            onRemove={() => onChange({ promoCode: "" })}
          />
        </div>
        <DateTimeField
          id={`return-dt-${tabKey}`}
          label="Return Date & Time"
          value={returnDateTime}
          isOpen={openDateField === "return"}
          onOpen={() => setOpenDateField("return")}
          show={showReturnLocation}
        />
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full whitespace-nowrap btn-primary px-4 md:px-5 lg:px-5 xl:px-5 2xl:px-6 py-2 md:py-2 lg:py-2 xl:py-2 2xl:py-3 text-base md:text-sm lg:text-xs xl:text-sm 2xl:text-base disabled:opacity-60"
          >
            {submitLoading ? "Validating..." : "Show cars"}
          </button>
          <PromoCodeLink
            variant="mobile"
            promoCode={data.promoCode}
            onAdd={() => setPromoOpen(true)}
            onRemove={() => onChange({ promoCode: "" })}
          />
        </div>
      </div>
      {openField && (
        <div className="relative mt-2">
          <div className="absolute z-50" role="presentation left-0">
            <LocationPicker
              field={openField}
              onSelect={(val, field, meta) => handleLocChange(field, val, meta)}
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
          singleMode={tabKey === "monthly"}
        />
      )}
      {deliveryOpen && (
        <DeliveryDialog
          open={deliveryOpen}
          onClose={() => setDeliveryOpen(false)}
          onBack={() => {
            setDeliveryOpen(false);
            handleOpen(deliveryTarget);
          }}
          target={deliveryTarget}
        />
      )}
      {promoOpen && (
        <PromoCodeDialog open={promoOpen} onClose={() => setPromoOpen(false)} />
      )}
      {showValidateModal && validationMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-11/12 max-w-sm rounded-lg shadow-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-black mb-3">Dollor</h3>
            <p className="text-base mb-6 text-black whitespace-pre-line">
              {validationMessage}
            </p>
            <button
              type="button"
              className="btn-primary px-3 py-2 w-20"
              onClick={() => {
                setShowValidateModal(false);
                setValidationMessage(null);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
