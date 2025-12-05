/**
 * Content Service - API service for anime/manga/novel content
 * Currently using mock data with simulated API delays
 * Returns plain objects (BaseContentData) - no class instances
 */

import type { MEDIA_TYPE } from "@/lib/constants/default";
import { getMockMediaSeries } from "../../mock/mock-base-content";
import {
  MediaSeries,
  MediaSeriesSchema,
} from "../../models/content/base-content";
import {
  isSuccessResponse,
  type PaginationMeta,
  type StandardResponse,
} from "../../types";
import api from "../../utils/fetch";
import { ApiParser } from "../../utils/parsers";

/**
 * Simulate API delay
 * Development: 200-500ms (fast enough for good UX, slow enough to test loading states)
 * Production: Remove this when using real API
 *
 * PERFORMANCE: Reduced from 1-2s to 200-500ms for better dev experience
 * Combined with caching, this provides instant subsequent loads
 */
async function mockDelay(min = 200, max = 500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Content Service Class
 */
export class ContentService {
  /**
   * Get featured content for hero section
   *
   * @example
   * ```ts
   * const featured = await ContentService.getFeatured();
   * console.log(featured.title);
   * console.log(featured.series.formattedViews);
   * ```
   */
  static async getFeatured(): Promise<MediaSeries> {
    // Simulate API call delay
    await mockDelay();

    // Simulate API response
    const response: StandardResponse<MediaSeries> = {
      success: true,
      message: "Featured content retrieved successfully",
      data: getMockMediaSeries(1)[0],
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch featured content");
    }

    return ApiParser.parse(MediaSeriesSchema, response);
  }

  /**
   * Get all featured content for carousel
   *
   * @example
   * ```ts
   * const featuredList = await ContentService.getFeaturedList();
   * console.log(featuredList.length); // 2
   * ```
   */
  static async getFeaturedList(): Promise<MediaSeries[]> {
    // Simulate API call delay
    await mockDelay();

    // Simulate API response with all featured items
    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Featured list retrieved successfully",
      data: getMockMediaSeries(5),
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch featured list");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }

  /**
   * Get trending series
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const trending = await ContentService.getTrending(5);
   * ```
   */
  static async getTrending(limit = 10): Promise<MediaSeries[]> {
    await mockDelay();

    // Filter and sort by views (trending = high views)
    const trending = getMockMediaSeries(20)
      .filter((s) => s.views >= 10000)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Trending series retrieved successfully",
      data: trending,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending series");
    }

    // Return plain objects directly - no class conversion needed
    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }

  /**
   * Get latest updated series
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const latest = await ContentService.getLatest(8);
   * ```
   */
  static async getLatest(limit = 10): Promise<MediaSeries[]> {
    await mockDelay();

    // Sort by updated_at (most recent first)
    const latest = getMockMediaSeries(20)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Latest series retrieved successfully",
      data: latest,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest series");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }

  /**
   * Get popular series (by favorites)
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const popular = await ContentService.getPopular(10);
   * ```
   */
  static async getPopular(limit = 10): Promise<MediaSeries[]> {
    await mockDelay();

    // Sort by favorites
    const popular = getMockMediaSeries(20)
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, limit);

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Popular series retrieved successfully",
      data: popular,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch popular series");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }

  /**
   * Get new series (created recently)
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const newSeries = await ContentService.getNew(6);
   * ```
   */
  static async getNew(limit = 10): Promise<MediaSeries[]> {
    await mockDelay();

    // Sort by created_at (newest first)
    const newSeries = getMockMediaSeries(20)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "New series retrieved successfully",
      data: newSeries,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new series");
    }

    return ApiParser.parseResponseArray(MediaSeriesSchema, response);
  }

  /**
   * Get trending series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getTrendingPaginated({ type: 'anime', page: 2, limit: 20 });
   * console.log(result.items); // Series[]
   * console.log(result.totalPages); // 5
   * ```
   */
  static async getTrendingPaginated(options?: {
    type?: MEDIA_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: MediaSeries[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};

    // Backend currently only supports limit, not full pagination for trending
    // So we fetch the top 'limit' items and return them as page 1
    const queryParams = new URLSearchParams({
      type,
      limit: limit.toString(),
      range: "week", // Default to weekly trending
    });

    const response = await api.get<StandardResponse<MediaSeries[]>>(
      `/analytics/trending?${queryParams.toString()}`
    );

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending series");
    }

    const items = ApiParser.parseResponseArray(MediaSeriesSchema, response);

    return {
      items,
      totalItems: items.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  /**
   * Get latest updated series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getLatestPaginated({ type: 'manga', page: 1 });
   * ```
   */
  static async getLatestPaginated(options?: {
    type?: MEDIA_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: MediaSeries[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = getMockMediaSeries(100);
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort by updated_at (most recent first)
    const sortedSeries = filteredSeries.toSorted(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Latest series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest series");
    }

    return {
      items: ApiParser.parseResponseArray(MediaSeriesSchema, response),
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }

  /**
   * Get new series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getNewPaginated({ type: 'novel', page: 1 });
   * ```
   */
  static async getNewPaginated(options?: {
    type?: MEDIA_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: MediaSeries[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = getMockMediaSeries(100);
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort by created_at (newest first)
    const sortedSeries = filteredSeries.toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "New series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new series");
    }

    return {
      items: ApiParser.parseResponseArray(MediaSeriesSchema, response),
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }
}
