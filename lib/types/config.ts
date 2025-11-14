export interface EnvConfig {
  apiBase: string;
  countryCode: string;
  clientKey: string;
  apiKey: string;
  endpoints: {
    branchAll: string;
    branchReadiness: (branchId: string, isDeliverToMe: boolean) => string;
    deliveryStates: string;
    deliveryBranchIds: (stateCode: string) => string;
    bookingValidate: string;
  };
}
