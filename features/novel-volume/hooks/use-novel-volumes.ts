"use client";

import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import useSWR from "swr";
import type { ListVolumesResponse, NovelVolume } from "../types";

// Re-export service
export { NovelVolumeService } from "../service";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await api.get<StandardResponse<any>>(url);
  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch data");
  }
  return response.data;
};

/**
 * Hook to get volumes by novel ID
 */
export function useNovelVolumes(novelId: string | null) {
  const url = novelId ? `/novels/${novelId}/volumes` : null;

  const { data, error, isLoading, mutate } = useSWR<ListVolumesResponse>(
    url,
    fetcher
  );

  return {
    volumes: data?.volumes || [],
    novelTitle: data?.novel_title,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to get a single volume
 */
export function useNovelVolume(volumeId: string | null) {
  const url = volumeId ? `/novels/volumes/${volumeId}` : null;

  const { data, error, isLoading, mutate } = useSWR<NovelVolume>(url, fetcher);

  return {
    volume: data,
    isLoading,
    error,
    mutate,
  };
}
