"use client";

/**
 * Admin Genres Hook - SWR-based data fetching + mutations for admin panel
 */

import type { StandardResponse } from "@/lib/api/types";
import { isSuccessResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { api } from "@/lib/api/utils/fetch";
import useSWR from "swr";
import type {
  CreateGenreRequest,
  Genre,
  GenreQuery,
  UpdateGenreRequest,
} from "../types";

interface GenreListResult {
  items: Genre[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

const fetcher = async (url: string): Promise<GenreListResult> => {
  const response = await api.get<StandardResponse<Genre[]>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch genres");
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
 * Hook for fetching genres list with SWR
 */
export function useGenres(params?: Partial<GenreQuery>) {
  const url = endpoint("genres", params || {});

  const { data, error, isLoading, mutate } = useSWR<GenreListResult>(
    url,
    fetcher
  );

  return {
    genres: data?.items || [],
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
 * Client-side service for genre mutations
 * Kept as object for easy migration from old GenreService pattern
 */
export const GenreService = {
  async getList(params: Partial<GenreQuery>): Promise<GenreListResult> {
    const url = endpoint("genres", params);
    const response = await api.get<StandardResponse<Genre[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genres");
    }

    return {
      items: response.data || [],
      total_items: response.meta?.total_items || 0,
      total_pages: response.meta?.total_pages || 1,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
    };
  },

  async create(data: CreateGenreRequest): Promise<Genre> {
    const url = endpoint("genres");
    const response = await api.post<StandardResponse<Genre>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to create genre");
    }

    return response.data!;
  },

  async update(id: string, data: UpdateGenreRequest): Promise<Genre> {
    const url = endpoint("genres", id);
    const response = await api.put<StandardResponse<Genre>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update genre");
    }

    return response.data!;
  },

  async delete(id: string): Promise<void> {
    const url = endpoint("genres", id);
    const response = await api.delete<StandardResponse<void>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to delete genre");
    }
  },
};
