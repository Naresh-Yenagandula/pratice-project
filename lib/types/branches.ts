export interface BranchGroup {
  id: string;
  name: string;
  branches: BranchRecord[];
}
export interface BranchRecord {
  name: string;
  hours?: string;
  description?: string;
  isSatellite?: boolean;
  address?: string;
  message?: string;
  googleLocationURL?: string;
  id?: string;
  stateCode?: string;
  stateName?: string;
}
export interface BranchReadinessResult {
  PickupOn: string;
  ReturnOn: string;
  HoursToGetReady: number;
  isClosedToday: boolean;
}
