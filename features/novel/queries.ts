/**
 * Novel Queries - Server-side data fetching
 * Uses React cache for automatic deduplication
 */

import { MediaSeriesSchema, type MediaSeries } from "@/features/content/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import {
  NovelBackendSchema,
  NovelFullResponseSchema,
  type NovelBackend,
  type NovelFullResponse,
} from "./types";

/**
 * Browse novels query parameters
 */
export interface BrowseNovelsQuery {
  page?: number;
  limit?: number;
  sort_by?: "views" | "last_chapter" | "created_at";
  sort_order?: "asc" | "desc";
  genre_ids?: string[];
  author_id?: string;
  artist_id?: string;
  owner_id?: string;
  key_search?: string;
  original_language?: string;
  status?: string;
}

/**
 * Browse novels result
 */
export interface BrowseNovelsResult {
  items: MediaSeries[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

/**
 * Get novels with filters and pagination
 * Calls /api/v1/novels
 */
export const getNovelsServer = cache(
  async (params?: BrowseNovelsQuery): Promise<BrowseNovelsResult> => {
    const query: Record<string, string | string[]> = {};

    if (params?.page) query.page = String(params.page);
    if (params?.limit) query.limit = String(params.limit);
    if (params?.sort_by) query.sort_by = params.sort_by;
    if (params?.sort_order) query.sort_order = params.sort_order;
    if (params?.genre_ids?.length) query.genre_ids = params.genre_ids;
    if (params?.author_id) query.author_id = params.author_id;
    if (params?.artist_id) query.artist_id = params.artist_id;
    if (params?.owner_id) query.owner_id = params.owner_id;
    if (params?.key_search) query.key_search = params.key_search;
    if (params?.status) query.status = params.status;
    if (params?.original_language)
      query.original_language = params.original_language;

    const url = endpoint("novels", query);

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: ["novels-browse"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch novels");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

    return {
      items,
      total_items: response.meta?.total_items || 0,
      total_pages: response.meta?.total_pages || 1,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
    };
  }
);

/**
 * Get novel by ID
 * Cached with React cache for deduplication
 */

export const getNovelById = cache(async (id: string): Promise<NovelBackend> => {
  const url = endpoint("novels", id);

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 60, // Cache 1 minute
      tags: [`novel-${id}`, "novels"],
    },
  });

  console.log(response);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch novel");
  }

  return ApiParser.parse(NovelBackendSchema, response);
});

/**
 * Get novel full data by slug
 * Calls /api/v1/novels/:slug/full
 * Returns complete novel data including volumes and chapters
 */

export const getNovelFull = cache(
  async (slug: string): Promise<NovelFullResponse> => {
    const url = endpoint("novels", slug, "full");

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: [`novel-${slug}`, `novel-full-${slug}`, "novels"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch novel");
    }

    return ApiParser.parse(NovelFullResponseSchema, response);
  }
);
