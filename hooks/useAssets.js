"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAssets, getMyAssetRequests, getAllAssetRequests } from "@/services/itAssetService";

export function useAllAssets() {
  return useQuery({
    queryKey: ["allAssets"],
    queryFn: getAllAssets,
    staleTime: 60 * 1000,
  });
}

export function useMyAssetRequests({ empId }) {
  return useQuery({
    queryKey: ["myAssetRequests", empId],
    queryFn: () => getMyAssetRequests({ empId }),
    enabled: !!empId,
    staleTime: 30 * 1000,
  });
}

export function useAllAssetRequests() {
  return useQuery({
    queryKey: ["allAssetRequests"],
    queryFn: getAllAssetRequests,
    staleTime: 30 * 1000,
  });
}
