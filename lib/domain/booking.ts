export interface BookingData {
  pickupLocation: string;
  returnLocation: string;
  sameReturn: boolean;
  pickupDateTime: string;
  returnDateTime: string;
  promoCode?: string;
  pickupBranchId?: string;
  returnBranchId?: string;
  // Branch selection meta (when chosen via LocationPicker)
  pickupStateCode?: string;
  pickupStateName?: string;
  returnStateCode?: string;
  returnStateName?: string;
  pickupAddress?: string; // branch address metadata
  returnAddress?: string; // branch address metadata
  // Mode flags to decide payload composition
  pickupMode?: "branch" | "deliver";
  returnMode?: "branch" | "collect";
  // Deliver to me (pickup leg) details
  deliveryStateCode?: string;
  deliveryStateName?: string;
  deliveryAddress?: string;
  // Collect from me (return leg) details
  collectStateCode?: string;
  collectStateName?: string;
  collectAddress?: string;
}
