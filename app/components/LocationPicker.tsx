"use client";
import React, { useEffect, useRef, useState } from "react";
import { LocationList } from "./location/LocationList";
import { useBranchGroups, filterGroups } from "../../lib/api/branches";
import { BranchRecord } from "../../lib/types/branches";
import { LocationPickerProps } from "../../lib/types/ui";
import { computeReadinessDatePatch } from "../../lib/services/locations";
import { LocationDetailPane } from "./location/LocationDetailPane";
import { MobileHeader } from "./location/MobileHeader";
import { useBooking } from "./BookingContext";

export default function LocationPicker({
  field,
  onSelect,
  onClose,
}: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<BranchRecord | null>(null);
  const [hoverPreview, setHoverPreview] = useState<BranchRecord | null>(null);
  const { groups, loading, error } = useBranchGroups();
  const { groups: filteredGroups, all: allVisible } = React.useMemo(
    () => filterGroups(groups, query),
    [groups, query]
  );

  useEffect(() => {
    const visibleNames = allVisible.map((l) => l.name);
    if (selected && !visibleNames.includes(selected.name)) setSelected(null);
    if (hoverPreview && !visibleNames.includes(hoverPreview.name))
      setHoverPreview(null);
    setFocusIndex(0);
  }, [query, allVisible]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (
        !containerRef.current ||
        containerRef.current.contains(e.target as Node)
      )
        return;
      onClose();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const { activeTab, dataByTab, updateTabData } = useBooking();

  const choose = async (loc: BranchRecord) => {
    setSelected(loc);
    setHoverPreview(null);
    try {
      const patch = await computeReadinessDatePatch(
        field,
        loc,
        dataByTab[activeTab]
      );
      if (Object.keys(patch).length) updateTabData(activeTab, patch);
    } catch (e) {
      console.warn("Readiness compute failed", e);
    }
    onSelect(loc.name, field, {
      branchId: loc.id,
      stateCode: loc.stateCode,
      stateName: loc.stateName,
      address: loc.address,
    });
    onClose();
  };

  const [focusIndex, setFocusIndex] = useState<number>(0);

  const activeDetail =
    hoverPreview || selected || (filteredGroups[0]?.branches[0] ?? null);

  return (
    <div
      role="dialog"
      aria-label={
        field === "pickup" ? "Select pickup location" : "Select return location"
      }
      ref={containerRef}
      className="z-50 fixed inset-0 w-full h-screen md:static md:h-[60vh] md:w-[90vw] lg:w-[80vw] md:rounded-2xl md:shadow-xl md:border md:border-gray-200 bg-white text-sm flex flex-col"
    >
      <MobileHeader
        field={field}
        query={query}
        setQuery={setQuery}
        inputRef={inputRef}
        onClose={onClose}
      />
      <div className="flex flex-1 min-h-0 md:flex-row md:h-full">
        <div className="flex flex-col flex-1 min-h-0">
          {loading && (
            <div className="px-4 py-2 text-xs text-gray-500">
              Loading locations...
            </div>
          )}
          {error && (
            <div className="px-4 py-2 text-xs text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <LocationList
              groups={filteredGroups}
              selected={selected}
              onSelect={(loc) => {
                choose(loc);
              }}
              onHover={setHoverPreview}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
              allVisible={allVisible}
            />
          )}
        </div>
        <LocationDetailPane detail={activeDetail} />
      </div>
    </div>
  );
}
