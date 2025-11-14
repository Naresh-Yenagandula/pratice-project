import { EnvConfig } from "../types/config";

function required(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

const apiBase = required(
  "NEXT_PUBLIC_API_BASE",
  "https://branch-main-poc-947985192778.us-central1.run.app/api"
);
const countryCode = required("NEXT_PUBLIC_COUNTRY_CODE", "UAE");

export const env: EnvConfig = {
  apiBase,
  countryCode,
  clientKey: required("NEXT_PUBLIC_CLIENT_KEY", "a"),
  apiKey: required("NEXT_PUBLIC_API_KEY", "a"),
  endpoints: {
    branchAll: `${apiBase}/branch/all?countryCode=${countryCode}`,
    branchReadiness: (branchId: string, isDeliverToMe: boolean) =>
      `${apiBase}/branch/hrsToGetReady?branchId=${encodeURIComponent(
        branchId
      )}&isDeliverToMe=${isDeliverToMe}`,
    deliveryStates: `${apiBase}/branch/deliveryMapping/allUI?countryCode=${countryCode}`,
    deliveryBranchIds: (stateCode: string) =>
      `${apiBase}/branch/deliveryMapping/branchIdByStateCode?stateCode=${encodeURIComponent(
        stateCode
      )}`,
    bookingValidate: `${apiBase}/booking/validate?countryCode=${countryCode}`,
  },
};

export const apiHeaders = () => ({
  Clientkey: env.clientKey,
  Apikey: env.apiKey,
});
