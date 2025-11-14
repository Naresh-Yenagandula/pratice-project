import { env, apiHeaders } from "../config/env";
import {
  BranchGroup,
  BranchRecord,
  BranchReadinessResult,
} from "../types/branches";

let _cache: { groups: BranchGroup[]; fetchedAt: number } | null = null;
let _inflight: Promise<BranchGroup[]> | null = null;
import { CACHE_TTL_MS } from "../config/constants";

export function invalidateBranchCache() {
  _cache = null;
}

export async function fetchBranchGroups(
  forceRefresh = false
): Promise<BranchGroup[]> {
  const now = Date.now();
  if (!forceRefresh && _cache && now - _cache.fetchedAt < CACHE_TTL_MS)
    return _cache.groups;
  if (_inflight) return _inflight;
  _inflight = (async () => {
    const url = typeof window === 'undefined' ? env.endpoints.branchAll : '/api/branches';
    const r = await fetch(url, { headers: typeof window === 'undefined' ? apiHeaders() : undefined });
    if (!r.ok) throw new Error(`Branch API failed: ${r.status}`);
    const data = await r.json();
    // Proxy returns { success, result }; direct upstream returns { result }
    const result = data?.result || [];
    const byId: Record<string, BranchGroup> = {};
    for (const branch of result) {
      const bt = branch.BranchType || {};
      const id = bt.BranchTypeID || bt.Name || "unknown";
      if (!byId[id]) byId[id] = { id, name: bt.Name || id, branches: [] };
      const hours = Array.isArray(branch.BranchOfficeTiming?.BranchTimings)
        ? branch.BranchOfficeTiming.BranchTimings.map(
            (t: any) => `${t.DayString}: ${t.Shifts.join(", ")}`
          ).join(" | ")
        : undefined;
      const branchId = branch._id || branch.BranchID || branch.Id || branch.ID;
      byId[id].branches.push({
        name: branch.Name,
        hours,
        description: branch.Description || undefined,
        message: branch.Message || undefined,
        address:
          branch.Address ||
          branch.AddressLine ||
          branch.AddressLine1 ||
          undefined,
        googleLocationURL:
          branch.GoogleLocationURL ||
          branch.GoogleMapURL ||
          branch.LocationGoogleURL ||
          undefined,
        isSatellite: /satellite/i.test(
          branch.Description || branch.Message || ""
        ),
        id: branchId,
        stateCode: branch.StateCode || branch.BranchStateCode || undefined,
        stateName: branch.StateName || branch.BranchStateName || undefined,
      });
    }
    const groups = Object.values(byId).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    _cache = { groups, fetchedAt: Date.now() };
    _inflight = null;
    return groups;
  })();
  return _inflight;
}

export function filterGroups(
  groups: BranchGroup[],
  query: string
): { groups: BranchGroup[]; all: BranchRecord[] } {
  const q = query.toLowerCase();
  const filtered = groups.map((g) => ({
    ...g,
    branches: g.branches.filter((b) => b.name.toLowerCase().includes(q)),
  }));
  return { groups: filtered, all: filtered.flatMap((g) => g.branches) };
}

import { useEffect, useState } from "react";
export function useBranchGroups(forceRefresh = false) {
  const [groups, setGroups] = useState<BranchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchBranchGroups(forceRefresh)
      .then((g) => mounted && setGroups(g))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);
  return { groups, loading, error };
}

export async function fetchBranchReadiness(
  branchId: string,
  isDeliverToMe = false
): Promise<BranchReadinessResult> {
  const url = typeof window === 'undefined'
    ? env.endpoints.branchReadiness(branchId, isDeliverToMe)
    : `/api/branch-readiness/${encodeURIComponent(branchId)}?isDeliverToMe=${isDeliverToMe}`;
  const r = await fetch(url, { headers: typeof window === 'undefined' ? apiHeaders() : undefined });
  if (!r.ok) throw new Error(`Readiness API failed: ${r.status}`);
  const data = await r.json();
  const result = data?.result;
  if (!result) throw new Error("Invalid readiness response");
  return result as BranchReadinessResult;
}
