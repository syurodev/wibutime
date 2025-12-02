/**
 * API Client for Novel Dashboard Data
 * Fetches statistics and metrics for dashboard visualizations
 */

import { DateRange } from "@/lib/utils/date-ranges";
import { MediaSeries } from "./models/content/base-content";
import { StandardResponse } from "./types";
import api from "./utils/fetch";

// ============================================================================
// Type Definitions
// ============================================================================

export interface DashboardStats {
  totalNovels: number;
  totalChapters: number;
  totalViews: number;
  totalFavorites: number;
  averageRating: number;
  activeNovels: number; // ongoing status count
  trend?: {
    novels: number; // percentage change
    chapters: number;
    views: number;
    favorites: number;
  };
}

export interface TimeSeriesData {
  date: string; // ISO date string
  views: number;
  chapters: number;
  novels?: number;
  favorites?: number;
}

export interface NovelStatusBreakdown {
  status: "draft" | "ongoing" | "completed" | "hiatus" | "dropped";
  count: number;
  percentage: number;
}

export interface TopNovel {
  id: string;
  title: string;
  coverImage?: string;
  status: "draft" | "ongoing" | "completed" | "hiatus" | "dropped";
  viewCount: number;
  favoriteCount: number;
  ratingAverage: number;
  ratingCount: number;
  totalChapters: number;
  totalWords: number;
  lastChapterAt?: string;
}

export interface PublishingActivityData {
  period: string; // Date or period label
  chaptersPublished: number;
  wordsPublished: number;
}

export type OwnerType = "user" | "tenant";

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * Get dashboard KPI statistics
 */
export async function getDashboardStats(
  ownerType: OwnerType,
  ownerId?: string
): Promise<DashboardStats> {
  // TODO: Implement real API call
  // const params = new URLSearchParams({
  //   owner_type: ownerType,
  //   ...(ownerId && { owner_id: ownerId }),
  // });
  // const response = await fetch(`/api/v1/dashboard/stats?${params}`);
  // return response.json();

  throw new Error("Not implemented - use mock data");
}

/**
 * Get time series data for charts
 */
export async function getNovelsTimeSeries(
  ownerType: OwnerType,
  ownerId?: string,
  dateRange: DateRange = "30d"
): Promise<TimeSeriesData[]> {
  // TODO: Implement real API call
  // const params = new URLSearchParams({
  //   owner_type: ownerType,
  //   range: dateRange,
  //   ...(ownerId && { owner_id: ownerId }),
  // });
  // const response = await fetch(`/api/v1/dashboard/time-series?${params}`);
  // return response.json();

  throw new Error("Not implemented - use mock data");
}

/**
 * Get novel status breakdown for pie chart
 */
export async function getNovelsByStatus(
  ownerType: OwnerType,
  ownerId?: string
): Promise<NovelStatusBreakdown[]> {
  // TODO: Implement real API call
  // const params = new URLSearchParams({
  //   owner_type: ownerType,
  //   ...(ownerId && { owner_id: ownerId }),
  // });
  // const response = await fetch(`/api/v1/dashboard/status-breakdown?${params}`);
  // return response.json();

  throw new Error("Not implemented - use mock data");
}

/**
 * Get top performing novels
 */
export async function getTopNovels(
  ownerType: OwnerType,
  ownerId?: string,
  sortBy: "views" | "favorites" | "rating" = "views",
  limit: number = 5
): Promise<TopNovel[]> {
  // TODO: Implement real API call
  // const params = new URLSearchParams({
  //   owner_type: ownerType,
  //   sort: sortBy,
  //   limit: limit.toString(),
  //   ...(ownerId && { owner_id: ownerId }),
  // });
  // const response = await fetch(`/api/v1/dashboard/top-novels?${params}`);
  // return response.json();

  throw new Error("Not implemented - use mock data");
}

/**
 * Get publishing activity data for bar chart
 */
export async function getPublishingActivity(
  ownerType: OwnerType,
  ownerId?: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
): Promise<PublishingActivityData[]> {
  // TODO: Implement real API call
  // const params = new URLSearchParams({
  //   owner_type: ownerType,
  //   period,
  //   ...(ownerId && { owner_id: ownerId }),
  // });
  // const response = await fetch(`/api/v1/dashboard/publishing-activity?${params}`);
  // return response.json();

  throw new Error("Not implemented - use mock data");
}
/**
 * Get list of novels with filtering
 */
export interface GetNovelsParams {
  page?: number;
  limit?: number;
  owner?: string; // Owner ID
  key_search?: string;
  genre_ids?: string[];
  status?: string[];
  original_language?: string;
  sort_by?: "created_at" | "rating" | "views" | "last_chapter";
  sort_order?: "asc" | "desc";
  token?: string; // Optional auth token for server-side calls
}

export async function getNovels(
  params: GetNovelsParams
): Promise<StandardResponse<MediaSeries[]>> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.owner) queryParams.append("owner", params.owner);
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
}
