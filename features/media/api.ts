/**
 * API Client for Media
 */

import { StandardResponse } from "@/lib/api/types";
import api from "@/lib/api/utils/fetch";
import {
  TopMediaResponseSchema,
  type TopMediaParams,
  type TopMediaResponse,
} from "./types";

/**
 * Get top media (anime, manga, novel)
 * Client-side API call
 */
export async function getTopMedia(
  params: TopMediaParams = {}
): Promise<StandardResponse<TopMediaResponse>> {
  const queryParams = new URLSearchParams();

  if (params.period) queryParams.append("period", params.period);
  if (params.offset !== undefined)
    queryParams.append("offset", params.offset.toString());
  if (params.limit !== undefined)
    queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const url = `/media/top${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<StandardResponse<unknown>>(url);

  if (response.success && response.data) {
    return {
      ...response,
      data: TopMediaResponseSchema.parse(response.data),
    };
  }

  return response as StandardResponse<TopMediaResponse>;
}
