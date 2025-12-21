/**
 * Genre Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  GenreSchema,
  type Genre,
  type GenreQuery,
} from "@/features/genre/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";

/**
 * Get top genres by views with optional rank comparison
 * Cached with React cache for deduplication
 *
 * @example
 * const genres = await getTopGenres({ limit: 10, period: "week", include_rank_change: true })
 */
export const getTopGenres = cache(
  async (params?: {
    limit?: number;
    period?: string;
    include_rank_change?: boolean;
    offset?: 0 | 1;
  }): Promise<Genre[]> => {
    const url = endpoint("genres", "top", {
      limit: params?.limit || 10,
      period: params?.period || "week",
      include_rank_change: params?.include_rank_change || false,
      offset: params?.offset || 0,
    });

    const response = await serverApi.get<StandardResponse<Genre>>(url, {
      next: {
        revalidate: 300,
        tags: [
          "genres",
          "top-genres",
          `top-genres-${params?.period}-${params?.limit}-${params?.include_rank_change}-${params?.offset}`,
        ],
      },
    });

    console.log("response top genres", response);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch top genres");
    }

    return ApiParser.parseResponseArray(GenreSchema, response);
  }
);

/**
 * Get list of genres with pagination
 * Cached with React cache for deduplication
 *
 * @example
 * const genres = await getGenres({ page: 1, limit: 20, search: "fantasy" })
 */
export const getGenres = cache(
  async (
    params?: Partial<GenreQuery>
  ): Promise<{
    items: Genre[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("genres", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: [
          "genres",
          `genres-${params?.search}-${params?.page}-${params?.limit}-${params?.sort_by}-${params?.sort_order}-${params?.active_only}`,
        ],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genres");
    }

    const items = ApiParser.parseResponseArray(GenreSchema, response);

    return {
      items,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
      total_items: response.meta?.total_items || items.length,
      total_pages: response.meta?.total_pages || 1,
    };
  }
);

/**
 * Get genre by ID
 * Cached with React cache for deduplication
 *
 * @example
 * const genre = await getGenreById("550e8400-e29b-41d4-a716-446655440000")
 */
export const getGenreById = cache(async (id: string): Promise<Genre> => {
  const url = endpoint("genres", id);

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 300, // Cache 5 minutes
      tags: [`genre-${id}`, "genres"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch genre");
  }

  return ApiParser.parse(GenreSchema, response);
});
