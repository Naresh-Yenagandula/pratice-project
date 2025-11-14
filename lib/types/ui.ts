import type { ReactNode, RefObject } from "react";
import type { BranchGroup, BranchRecord } from "./branches";
import type { BookingData } from "../domain/booking";

export type LocationFieldName = "pickup" | "returnLoc";

export interface LocationPickerProps {
  field: LocationFieldName;
  onSelect: (
    value: string,
    field: LocationFieldName,
    meta?: {
      branchId?: string;
      stateCode?: string;
      stateName?: string;
      address?: string;
    }
  ) => void;
  onClose: () => void;
}

export interface LocationFieldProps {
  id: string;
  field: LocationFieldName;
  label: string;
  value: string;
  placeholder?: string;
  isOpen: boolean;
  onOpen: () => void;
  onChange: (value: string) => void;
  sameReturn?: boolean;
  showReturnLocation?: boolean;
  showCheckbox?: boolean;
  onToggleSameReturn?: (checked: boolean) => void;
  actionButton?: ReactNode;
  wrapperClassName?: string;
}

export interface TimeAdjusterProps {
  label: string;
  time: string;
  onChange: (newTime: string) => void;
  date?: Date | null;
}

export interface MonthCalendarProps {
  days: Date[];
  monthLabel: string;
  firstDate: Date | null;
  secondDate: Date | null;
  hoverDate: Date | null;
  inRange: (d: Date) => boolean;
  onDayClick: (d: Date) => void;
  onDayHover?: (d: Date) => void;
  onDayHoverEnd?: () => void;
  startOfToday: Date;
  hideOnMobile?: boolean;
}

export interface DateTimeFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  isOpen: boolean;
  onOpen: () => void;
  showMobileLabel?: boolean;
  show?: boolean;
}

export interface DeliveryLinkProps {
  variant: LocationFieldName;
  onClick: () => void;
}

export interface PromoCodeDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  target: LocationFieldName;
}

export interface BookingContextValue {
  dataByTab: Record<string, BookingData>;
  activeTab: string;
  setActiveTab: (k: string) => void;
  updateTabData: (tab: string, patch: Partial<BookingData>) => void;
}

export interface BookingPanelProps {
  tabKey: string;
  data: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
}

export interface MobileHeaderProps {
  field: LocationFieldName;
  query: string;
  setQuery: (val: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
}

export interface TabConfig {
  key: string;
  label: string;
}

export interface VehicleFeature {
  icon: string;
  label: string;
  value: string;
}

export interface VehicleCardProps {
  name: string;
  variant?: string;
  image: string;
  offerBadge?: string;
  payNowAmount: string;
  payLaterAmount: string;
  features: VehicleFeature[];
  onPayNow?: () => void;
  onPayLater?: () => void;
}

export interface LocationListProps {
  groups: BranchGroup[];
  selected?: BranchRecord | null;
  onSelect: (loc: BranchRecord) => void;
  onHover: (loc: BranchRecord | null) => void;
  focusIndex: number;
  setFocusIndex: (fn: (i: number) => number) => void;
  allVisible: BranchRecord[];
}

export interface LocationDetailPaneProps {
  detail?: BranchRecord | null;
}

export interface DateTimeDialogProps {
  open: boolean;
  pickupDateTime: string;
  returnDateTime: string;
  pickupLocation?: string;
  returnLocation?: string;
  onChange: (patch: {
    pickupDateTime?: string;
    returnDateTime?: string;
  }) => void;
  onClose: () => void;
  singleMode?: boolean;
}
