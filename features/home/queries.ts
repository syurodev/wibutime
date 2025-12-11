/**
 * Home Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { cache } from "react";
import { HomeDataSchema, type HomeData } from "./types";

/**
 * Empty home data for fallback
 */
const EMPTY_HOME_DATA: HomeData = {
  hero: [],
  trending: [],
  creators: [],
  genres: [],
};

/**
 * Get aggregated home page data
 * Calls /api/v1/public/home - single endpoint with cached data from backend
 *
 * @example
 * const homeData = await getHomeData()
 */
export const getHomeData = cache(async (): Promise<HomeData> => {
  try {
    const response = await serverApi.get<StandardResponse<unknown>>(
      "/media/home",
      {
        next: {
          revalidate: 60, // Revalidate every 1 minute (backend caches for 10 min)
          tags: ["home-data"],
        },
      }
    );

    if (!isSuccessResponse(response)) {
      console.error("Failed to fetch home data:", response.message);
      return EMPTY_HOME_DATA;
    }

    // Parse and validate response data
    const parsed = HomeDataSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Home data validation failed:", parsed.error);
      return EMPTY_HOME_DATA;
    }

    return parsed.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return EMPTY_HOME_DATA;
  }
});
