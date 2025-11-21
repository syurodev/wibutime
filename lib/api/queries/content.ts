/**
 * Content Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  MediaSeriesSchema,
  type MediaSeries,
} from "@/lib/api/models/content/base-content";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import { cache } from "react";

/**
 * Content query parameters
 */
export interface ContentQuery {
  page?: number;
  limit?: number;
  type?: CONTENT_TYPE | "all";
  sort?: "recent" | "title" | "updated" | "rating";
}

/**
 * Get featured content
 *
 * @example
 * const featured = await getFeaturedContent()
 */
export const getFeaturedContent = cache(async (): Promise<MediaSeries> => {
  const url = endpoint("content", "featured");

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 300, // Cache 5 minutes
      tags: ["content-featured"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch featured content");
  }

  return ApiParser.parse(MediaSeriesSchema, response);
});

/**
 * Get featured content list for carousel
 *
 * @example
 * const featuredList = await getFeaturedContentList()
 */
export const getFeaturedContentList = cache(
  async (): Promise<MediaSeries[]> => {
    const url = endpoint("content", "featured", "list");

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["content-featured"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch featured list");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }
);

/**
 * Get trending content
 *
 * @example
 * const trending = await getTrendingContent({ limit: 10, type: "anime" })
 */
export const getTrendingContent = cache(
  async (
    params?: Partial<ContentQuery>
  ): Promise<{
    items: MediaSeries[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("content", "trending", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["content-trending"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending content");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

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
 * Get latest content
 *
 * @example
 * const latest = await getLatestContent({ limit: 10, type: "manga" })
 */
export const getLatestContent = cache(
  async (
    params?: Partial<ContentQuery>
  ): Promise<{
    items: MediaSeries[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("content", "latest", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["content-latest"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest content");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

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
 * Get new content
 *
 * @example
 * const newContent = await getNewContent({ limit: 10, type: "novel" })
 */
export const getNewContent = cache(
  async (
    params?: Partial<ContentQuery>
  ): Promise<{
    items: MediaSeries[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("content", "new", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["content-new"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new content");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

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
 * Get popular content (by favorites)
 *
 * @example
 * const popular = await getPopularContent({ limit: 10 })
 */
export const getPopularContent = cache(
  async (
    params?: Partial<ContentQuery>
  ): Promise<{
    items: MediaSeries[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("content", "popular", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["content-popular"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch popular content");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

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
 * Get user library
 *
 * @example
 * const library = await getUserLibrary({ page: 1, sort: "title" })
 */
export const getUserLibrary = cache(
  async (
    params?: Partial<ContentQuery>
  ): Promise<{
    items: MediaSeries[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("content", "library", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: ["user-library"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch user library");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

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
 * Get content by ID
 *
 * @example
 * const content = await getContentById("550e8400-e29b-41d4-a716-446655440000")
 */
export const getContentById = cache(
  async (id: string): Promise<MediaSeries> => {
    const url = endpoint("content", id);

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: [`content-${id}`, "content"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch content");
    }

    return ApiParser.parse(MediaSeriesSchema, response);
  }
);
