import { env, apiHeaders } from "../config/env";
import { BookingData } from "../domain/booking";
import { ValidateResponse } from "../types/bookingValidation";

export function buildValidationPayload(tabKey: string, data: BookingData): any {
  const formatForValidate = (dt: string) =>
    dt.replace("|", ",").replace(/\s+/g, " ").trim();
  const pickupDT = formatForValidate(data.pickupDateTime);
  const returnDT = formatForValidate(data.returnDateTime);
  const isPickupBranch =
    (data.pickupMode || "branch") === "branch" && !!data.pickupBranchId;
  const isReturnBranch =
    (data.returnMode || "branch") === "branch" && !!data.returnBranchId;

  if (tabKey === "monthly") {
    const payload: any = {
      CheckOutOn: pickupDT,
      PromoCode: data.promoCode || "",
      Daily: false,
      IPLocation: {
        IPAddress: "Not found",
        Country_code: "Not found",
        Country_name: "Not found",
      },
    };
    if (isPickupBranch) {
      payload.CheckOutBranchID = data.pickupBranchId;
    } else if (data.pickupMode === "deliver") {
      payload.DeliveryDetails = {
        StateName: data.deliveryStateName || "",
        StateCode: data.deliveryStateCode || "",
        Address: data.deliveryAddress || data.pickupLocation || "",
      };
    }
    return payload;
  }
  const rentalDays = Math.max(
    1,
    Math.ceil(
      ((new Date(data.returnDateTime.split("|")[0]) as any) -
        (new Date(data.pickupDateTime.split("|")[0]) as any)) /
        (1000 * 60 * 60 * 24)
    )
  );
  const payload: any = {
    CheckOutOn: pickupDT,
    CheckInOn: returnDT,
    Daily: true,
    RentalDays: rentalDays,
    IPLocation: {
      IPAddress: "Not found",
      Country_code: "Not found",
      Country_name: "Not found",
    },
    PromoCode: data.promoCode || "",
  };
  if (isPickupBranch) {
    payload.CheckOutBranchID = data.pickupBranchId;
  } else if (data.pickupMode === "deliver") {
    payload.DeliveryDetails = {
      StateName: data.deliveryStateName || "",
      StateCode: data.deliveryStateCode || "",
      Address: data.deliveryAddress || data.pickupLocation || "",
    };
  }
  if (isReturnBranch) {
    payload.CheckInBranchID = data.returnBranchId;
  } else if (data.returnMode === "collect") {
    payload.PickupDetails = {
      StateName: data.collectStateName || "",
      StateCode: data.collectStateCode || "",
      Address: data.collectAddress || data.returnLocation || "",
    };
  }
  return payload;
}

export async function validateBooking(
  tabKey: string,
  data: BookingData
): Promise<ValidateResponse> {
  const payload = buildValidationPayload(tabKey, data);
  try {
    const r = await fetch(env.endpoints.bookingValidate, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders() },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`Validate failed: ${r.status}`);
    const json = await r.json();
    const isPassed = !!json?.result?.data?.isPassed;
    const msg = json?.result?.data?.message || json?.message || "";
    try {
      sessionStorage.setItem("VALIDATE_RESULT", JSON.stringify(json));
    } catch {}
    return { success: true, isPassed, message: msg, raw: json };
  } catch (e: any) {
    return {
      success: false,
      isPassed: false,
      message: e.message || "Validation failed",
    };
  }
}
