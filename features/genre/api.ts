/**
 * API Client for Genres
 */

import { StandardResponse } from "@/lib/api/types";
import api from "@/lib/api/utils/fetch";
import { GenreStats } from "./types";

export interface GetGenresParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "name" | "views" | "series" | "created" | "updated" | "readers";
  sort_order?: "asc" | "desc";
  active_only?: boolean;
}

/**
 * Get list of genres
 */
export async function getGenres(
  params: GetGenresParams = {}
): Promise<StandardResponse<GenreStats[]>> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.sort_by) queryParams.append("sort_by", params.sort_by);
  if (params.sort_order) queryParams.append("sort_order", params.sort_order);
  if (params.active_only) queryParams.append("active_only", "true");

  return api.get<StandardResponse<GenreStats[]>>(
    `/genres?${queryParams.toString()}`
  );
}
