import { fetchBranchReadiness } from "../api/branches";
import { BranchRecord } from "../types/branches";
import { formatDubaiDateTime } from "../utils/date";
import { BookingData } from "../domain/booking";

export type LocationField = "pickup" | "returnLoc";

export async function computeReadinessDatePatch(
  field: LocationField,
  loc: BranchRecord,
  current: BookingData
): Promise<Partial<BookingData>> {
  const patch: Partial<BookingData> = {};
  if (!loc?.id) return patch;
  try {
    const readiness = await fetchBranchReadiness(loc.id);
    if (field === "pickup") {
      const pickup = formatDubaiDateTime(readiness.PickupOn);
      patch.pickupDateTime = pickup || current.pickupDateTime;
      if (current.sameReturn) {
        const ret = formatDubaiDateTime(readiness.ReturnOn);
        patch.returnDateTime = ret || current.returnDateTime;
      }
    } else if (field === "returnLoc") {
      const ret = formatDubaiDateTime(readiness.ReturnOn);
      patch.returnDateTime = ret || current.returnDateTime;
    }
  } catch (e) {}
  return patch;
}
