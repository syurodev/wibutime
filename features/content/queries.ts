/**
 * Content Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import { MediaSeriesSchema, type MediaSeries } from "./types";

/**
 * Analytics trending query parameters
 */
export interface AnalyticsTrendingQuery {
  type?: "all" | "novel" | "manga" | "anime";
  range?: "day" | "week" | "month";
  limit?: number;
}

/**
 * Get analytics trending content
 * Calls /api/v1/analytics/trending
 *
 * @example
 * const trending = await getAnalyticsTrending({ type: "all", range: "week", limit: 6 })
 */
export const getAnalyticsTrending = cache(
  async (params?: AnalyticsTrendingQuery): Promise<MediaSeries[]> => {
    const url = endpoint("analytics", "trending", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["analytics-trending"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch analytics trending");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }
);

export const getHeroFeatured = cache(async (limit = 6) => {
  return getAnalyticsTrending({ type: "all", range: "week", limit });
});

/**
 * Get featured content for Trending section
 * Uses analytics trending with default type=all, range=week
 * Default limit 20 to fit responsive grids (20/2=10, 18/3=6, 20/5=4)
 */
export const getTrendingFeatured = cache(async (limit = 20) => {
  return getAnalyticsTrending({ type: "all", range: "week", limit });
});
