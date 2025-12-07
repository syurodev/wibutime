import { MediaSeries } from "@/features/content/types";
import { type StandardResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import { DateRange } from "@/lib/utils/date-ranges";
import type {
  DashboardStats,
  GetNovelsParams,
  NovelStatusBreakdown,
  OwnerType,
  PublishingActivityData,
  TimeSeriesData,
  TopNovel,
} from "./types";

/**
 * Novel Service - Universal API calls
 */
export const NovelService = {
  /**
   * Get list of novels with filtering
   */
  async getList(
    params: GetNovelsParams
  ): Promise<StandardResponse<MediaSeries[]>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.owner) queryParams.append("owner", params.owner);
    if (params.author_id) queryParams.append("author_id", params.author_id);
    if (params.artist_id) queryParams.append("artist_id", params.artist_id);
    if (params.key_search) queryParams.append("key_search", params.key_search);
    if (params.original_language)
      queryParams.append("original_language", params.original_language);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    // Handle arrays
    if (params.genre_ids) {
      params.genre_ids.forEach((id) => queryParams.append("genre_ids", id));
    }
    if (params.status) {
      params.status.forEach((s) => queryParams.append("status", s));
    }

    return api.get<StandardResponse<MediaSeries[]>>(
      `/novels?${queryParams.toString()}`,
      { token: params.token }
    );
  },

  /**
   * Get dashboard KPI statistics
   */
  async getDashboardStats(
    ownerType: OwnerType,
    ownerId?: string
  ): Promise<DashboardStats> {
    throw new Error("Not implemented - use mock data");
  },

  /**
   * Get time series data for charts
   */
  async getTimeSeries(
    ownerType: OwnerType,
    ownerId?: string,
    dateRange: DateRange = "30d"
  ): Promise<TimeSeriesData[]> {
    throw new Error("Not implemented - use mock data");
  },

  /**
   * Get novel status breakdown
   */
  async getStatusBreakdown(
    ownerType: OwnerType,
    ownerId?: string
  ): Promise<NovelStatusBreakdown[]> {
    throw new Error("Not implemented - use mock data");
  },

  /**
   * Get top performing novels
   */
  async getTopNovels(
    ownerType: OwnerType,
    ownerId?: string,
    sortBy: "views" | "favorites" | "rating" = "views",
    limit: number = 5
  ): Promise<TopNovel[]> {
    throw new Error("Not implemented - use mock data");
  },

  /**
   * Get publishing activity data
   */
  async getPublishingActivity(
    ownerType: OwnerType,
    ownerId?: string,
    period: "daily" | "weekly" | "monthly" = "weekly"
  ): Promise<PublishingActivityData[]> {
    throw new Error("Not implemented - use mock data");
  },
};
