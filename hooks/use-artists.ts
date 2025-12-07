"use client";

import type { StandardResponse } from "@/lib/api/types/response";
import { endpoint } from "@/lib/api/utils/endpoint";
import { api } from "@/lib/api/utils/fetch";
import useSWRInfinite from "swr/infinite";

export interface Artist {
  id: string;
  name: string;
}

interface ArtistSelectionResponse {
  items: Artist[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

const fetcher = async (url: string) => {
  const response = await api.get<StandardResponse<Artist[]>>(url);
  return {
    items: response.data || [],
    meta: response.meta || {
      page: 1,
      limit: 20,
      total_items: 0,
      total_pages: 0,
    },
  };
};

export function useArtists(search?: string) {
  const getKey = (
    pageIndex: number,
    previousPageData: ArtistSelectionResponse | null
  ) => {
    // Reached the end
    if (
      previousPageData &&
      previousPageData.meta.page >= previousPageData.meta.total_pages
    ) {
      return null;
    }

    const page = pageIndex + 1;
    return endpoint("artists", "selection", { search, page, limit: 20 });
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(getKey, fetcher, {
      revalidateFirstPage: false,
      dedupingInterval: 300, // Debounce
    });

  // Flatten all pages
  const allItems = data ? data.flatMap((page) => page.items) : [];
  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage
    ? lastPage.meta.page < lastPage.meta.total_pages
    : true;
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const loadMore = () => {
    if (!isLoading && !isValidating && hasMore) {
      setSize(size + 1);
    }
  };

  return {
    data: allItems,
    isLoading,
    error,
    loadMore,
    hasMore,
    isLoadingMore: isLoadingMore || isValidating,
    refetch: mutate,
  };
}
