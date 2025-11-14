import { BookingData } from "../domain/booking";

interface Meta {
  branchId?: string;
  stateCode?: string;
  stateName?: string;
  address?: string;
}

export function composeLocationPatch(
  field: "pickup" | "returnLoc",
  value: string,
  sameReturn: boolean,
  meta?: Meta
): Partial<BookingData> {
  if (field === "pickup" && sameReturn) {
    return {
      pickupLocation: value,
      returnLocation: value,
      pickupBranchId: meta?.branchId,
      returnBranchId: meta?.branchId,
      pickupStateCode: meta?.stateCode,
      pickupStateName: meta?.stateName,
      returnStateCode: meta?.stateCode,
      returnStateName: meta?.stateName,
      pickupAddress: meta?.address,
      returnAddress: meta?.address,
      pickupMode: "branch",
      returnMode: "branch",
    };
  }
  if (field === "pickup") {
    return {
      pickupLocation: value,
      pickupBranchId: meta?.branchId,
      pickupStateCode: meta?.stateCode,
      pickupStateName: meta?.stateName,
      pickupAddress: meta?.address,
      pickupMode: "branch",
    };
  }
  return {
    returnLocation: value,
    returnBranchId: meta?.branchId,
    returnStateCode: meta?.stateCode,
    returnStateName: meta?.stateName,
    returnAddress: meta?.address,
    returnMode: "branch",
  };
}
