import { env, apiHeaders } from "../config/env";
import { DeliveryState } from "../types/delivery";

import { CACHE_TTL_MS } from "../config/constants";
let _cache: { states: DeliveryState[]; fetchedAt: number } | null = null;
let _inflight: Promise<DeliveryState[]> | null = null;

export function invalidateDeliveryCache() {
  _cache = null;
}

export async function fetchDeliveryStates(
  forceRefresh = false
): Promise<DeliveryState[]> {
  const now = Date.now();
  if (!forceRefresh && _cache && now - _cache.fetchedAt < CACHE_TTL_MS)
    return _cache.states;
  if (_inflight) return _inflight;
  _inflight = (async () => {
    const r = await fetch(env.endpoints.deliveryStates, {
      headers: apiHeaders(),
    });
    if (!r.ok) throw new Error(`Delivery mapping API failed: ${r.status}`);
    const data = await r.json();
    const result = Array.isArray(data?.result) ? data.result : [];
    const states: DeliveryState[] = (result as any[])
      .map((s) => ({
        code: s?.StateCode || s?.Code || s?.stateCode || "",
        name: s?.StateName || s?.Name || s?.stateName || "",
      }))
      .filter((s) => s.name);
    states.sort((a, b) => a.name.localeCompare(b.name));
    _cache = { states, fetchedAt: Date.now() };
    _inflight = null;
    return states;
  })();
  return _inflight;
}

import { useEffect, useState } from "react";
export function useDeliveryStates(forceRefresh = false) {
  const [states, setStates] = useState<DeliveryState[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDeliveryStates(forceRefresh)
      .then((st) => mounted && setStates(st))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);
  return { states, loading, error };
}

let _branchIdsCache: {
  [stateCode: string]: { ids: string[]; fetchedAt: number };
} = {};
let _branchIdsInflight: { [stateCode: string]: Promise<string[]> } = {};

export async function fetchBranchIdsByStateCode(
  stateCode: string,
  forceRefresh = false
): Promise<string[]> {
  if (!stateCode) return [];
  const now = Date.now();
  const cached = _branchIdsCache[stateCode];
  if (!forceRefresh && cached && now - cached.fetchedAt < CACHE_TTL_MS)
    return cached.ids;
  const inflight = _branchIdsInflight[stateCode];
  if (inflight) return inflight;
  const endpoint = env.endpoints.deliveryBranchIds(stateCode);
  const promise = (async () => {
    const r = await fetch(endpoint, { headers: apiHeaders() });
    if (!r.ok) throw new Error(`BranchId API failed: ${r.status}`);
    const data = await r.json();
    const ids: string[] = Array.isArray(data?.result)
      ? data.result.filter((x: any) => typeof x === "string")
      : [];
    _branchIdsCache[stateCode] = { ids, fetchedAt: Date.now() };
    delete _branchIdsInflight[stateCode];
    return ids;
  })();
  _branchIdsInflight[stateCode] = promise;
  return promise;
}

export function useBranchIds(stateCode: string) {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!stateCode) {
      setIds([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    fetchBranchIdsByStateCode(stateCode)
      .then((b) => mounted && setIds(b))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [stateCode]);
  return { ids, loading, error };
}
