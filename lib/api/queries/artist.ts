/**
 * Artist Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  ArtistArraySchema,
  ArtistSchema,
  type Artist,
  type ArtistQuery,
} from "@/lib/api/models/admin/artist";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";

/**
 * Get list of artists with pagination
 *
 * @example
 * const artists = await getArtists({ page: 1, limit: 20, search: "jane" })
 */
export const getArtists = cache(
  async (params?: Partial<ArtistQuery>): Promise<{
    items: Artist[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("artists", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["artists"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch artists");
    }

    const items = ApiParser.parseResponseArray(ArtistArraySchema, response);

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
 * Get artist by ID
 *
 * @example
 * const artist = await getArtistById("550e8400-e29b-41d4-a716-446655440000")
 */
export const getArtistById = cache(async (id: string): Promise<Artist> => {
  const url = endpoint("artists", id);

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 300, // Cache 5 minutes
      tags: [`artist-${id}`, "artists"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch artist");
  }

  return ApiParser.parse(ArtistSchema, response);
});
