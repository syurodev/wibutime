/**
 * Media Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { cache } from "react";
import {
  TopMediaResponseSchema,
  type TopMediaParams,
  type TopMediaResponse,
} from "./types";

/**
 * Get top media (anime, manga, novel) with rank comparison
 * Cached with React cache for deduplication
 *
 * @example
 * const topMedia = await getTopMedia({ period: "week" })
 * // => { anime: null, manga: null, novel: { id: "...", title: "...", current_rank: 1 } }
 */
export const getTopMedia = cache(
  async (params?: TopMediaParams): Promise<TopMediaResponse> => {
    const period = params?.period || "week";
    const offset = params?.offset || 0;
    const limit = params?.limit || 1;
    const url = endpoint("media", "top", { period, offset, limit });

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["media", "top-media", `top-media-${period}`],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch top media");
    }

    // Parse response with Zod schema
    return TopMediaResponseSchema.parse(response.data);
  }
);

/**
 * Get top novel only (convenience function)
 */
export const getTopNovel = cache(
  async (period: TopMediaParams["period"] = "week") => {
    const topMedia = await getTopMedia({ period });
    return topMedia.novel;
  }
);

/**
 * Get top manga only (convenience function)
 */
export const getTopManga = cache(
  async (period: TopMediaParams["period"] = "week") => {
    const topMedia = await getTopMedia({ period });
    return topMedia.manga;
  }
);

/**
 * Get top anime only (convenience function)
 */
export const getTopAnime = cache(
  async (period: TopMediaParams["period"] = "week") => {
    const topMedia = await getTopMedia({ period });
    return topMedia.anime;
  }
);
