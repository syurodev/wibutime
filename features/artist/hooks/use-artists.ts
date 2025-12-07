"use client";

/**
 * Artists Hook - SWR-based data fetching + mutations
 */

import type { StandardResponse } from "@/lib/api/types";
import { isSuccessResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { api } from "@/lib/api/utils/fetch";
import useSWR from "swr";
import type {
  Artist,
  ArtistQuery,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../types";

interface ArtistListResult {
  items: Artist[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

const fetcher = async (url: string): Promise<ArtistListResult> => {
  const response = await api.get<StandardResponse<Artist[]>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch artists");
  }

  return {
    items: response.data || [],
    total_items: response.meta?.total_items || 0,
    total_pages: response.meta?.total_pages || 1,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || 20,
  };
};

/**
 * Hook for fetching artists list with SWR
 */
export function useArtists(params?: Partial<ArtistQuery>) {
  const url = endpoint("artists", params || {});

  const { data, error, isLoading, mutate } = useSWR<ArtistListResult>(
    url,
    fetcher
  );

  return {
    artists: data?.items || [],
    totalItems: data?.total_items || 0,
    totalPages: data?.total_pages || 1,
    page: data?.page || 1,
    limit: data?.limit || 20,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Client-side service for artist mutations
 */
export const ArtistService = {
  async getList(params: Partial<ArtistQuery>): Promise<ArtistListResult> {
    const url = endpoint("artists", params);
    const response = await api.get<StandardResponse<Artist[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch artists");
    }

    return {
      items: response.data || [],
      total_items: response.meta?.total_items || 0,
      total_pages: response.meta?.total_pages || 1,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
    };
  },

  async create(data: CreateArtistRequest): Promise<Artist> {
    const url = endpoint("artists");
    const response = await api.post<StandardResponse<Artist>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to create artist");
    }

    return response.data!;
  },

  async update(id: string, data: UpdateArtistRequest): Promise<Artist> {
    const url = endpoint("artists", id);
    const response = await api.put<StandardResponse<Artist>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update artist");
    }

    return response.data!;
  },

  async delete(id: string): Promise<void> {
    const url = endpoint("artists", id);
    const response = await api.delete<StandardResponse<void>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to delete artist");
    }
  },
};
