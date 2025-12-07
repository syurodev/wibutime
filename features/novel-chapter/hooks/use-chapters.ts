"use client";

import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import useSWR from "swr";
import type { ListChaptersResponse, NovelChapter } from "../types";

// Re-export service from client wrapper if needed, or import directly
export { ChapterService } from "../service";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await api.get<StandardResponse<any>>(url);
  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch data");
  }
  return response.data;
};

/**
 * Hook to get chapters by volume ID
 */
export function useVolumeChapters(volumeId: string | null) {
  const url = volumeId ? `/novels/volumes/${volumeId}/chapters` : null;

  const { data, error, isLoading, mutate } = useSWR<ListChaptersResponse>(
    url,
    fetcher
  );

  return {
    chapters: data?.chapters || [],
    volumeTitle: data?.volume_title,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to get a single chapter
 */
export function useChapter(chapterId: string | null) {
  const url = chapterId ? `/novels/chapters/${chapterId}` : null;

  const { data, error, isLoading, mutate } = useSWR<NovelChapter>(url, fetcher);

  return {
    chapter: data,
    isLoading,
    error,
    mutate,
  };
}
