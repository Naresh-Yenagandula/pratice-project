"use client";
import { LocationListProps } from "../../../lib/types/ui";
import { Plane, MapPin } from "lucide-react";
import { useCallback } from "react";

export function LocationList({
  groups,
  selected,
  onSelect,
  onHover,
  focusIndex,
  setFocusIndex,
  allVisible,
}: LocationListProps) {
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!allVisible.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % allVisible.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => (i - 1 + allVisible.length) % allVisible.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(allVisible[focusIndex]);
      }
    },
    [allVisible, focusIndex, onSelect, setFocusIndex]
  );

  const iconFor = (groupName: string) => {
    if (/airport/i.test(groupName)) return <Plane className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div
      className="flex flex-col flex-1 min-h-0"
      onKeyDown={handleKey}
      tabIndex={0}
      aria-label="Locations list"
    >
      <div
        className="flex-1 min-h-0 overflow-y-scroll custom-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {groups.map((g) => (
          <div
            key={g.id}
            className="py-3 border-t first:border-t-0 border-gray-200"
          >
            <h4 className="flex items-center gap-2 px-4 mb-2 font-semibold text-black text-base">
              {iconFor(g.name)} {g.name}
            </h4>
            <ul className="divide-y divide-gray-100">
              {g.branches.map((b) => (
                <li key={b.name}>
                  <button
                    type="button"
                    onClick={() => onSelect(b)}
                    onMouseEnter={() => onHover(b)}
                    onMouseLeave={() => onHover(null)}
                    className={`w-full text-left px-4 py-4 focus:outline-none ${
                      selected?.name === b.name
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-black"
                    }`}
                  >
                    {b.name}
                  </button>
                </li>
              ))}
              {!g.branches.length && (
                <li className="px-4 py-2 text-xs text-gray-400">No matches</li>
              )}
            </ul>
          </div>
        ))}
        {!groups.length && (
          <div className="px-4 py-2 text-xs text-gray-400">
            No locations loaded
          </div>
        )}
      </div>
    </div>
  );
}
