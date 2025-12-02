import { isSuccessResponse, type StandardResponse } from "../types";
import { endpoint } from "../utils/endpoint";
import { ApiError } from "../utils/error-handler";
import { apiFetch } from "../utils/fetch";

export interface SelectionItem {
  id: string;
  name: string;
}

export const SelectionService = {
  getGenres: async (search?: string, limit = 100) => {
    const url = endpoint("genres", "selection", { search, limit });

    // Parse theo StandardResponse từ backend
    const response = await apiFetch<StandardResponse<SelectionItem[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new ApiError(response.message || "Failed to fetch genre selection");
    }

    return {
      items: response.data || [],
      meta: response.meta || {
        page: 1,
        limit,
        total_items: 0,
        total_pages: 0,
      },
    };
  },

  getAuthors: async (search?: string, limit = 100) => {
    const url = endpoint("authors", "selection", { search, limit });

    // Parse theo StandardResponse từ backend
    const response = await apiFetch<StandardResponse<SelectionItem[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new ApiError(
        response.message || "Failed to fetch author selection"
      );
    }

    return {
      items: response.data || [],
      meta: response.meta || {
        page: 1,
        limit,
        total_items: 0,
        total_pages: 0,
      },
    };
  },

  getArtists: async (search?: string, limit = 100) => {
    const url = endpoint("artists", "selection", { search, limit });

    // Parse theo StandardResponse từ backend
    const response = await apiFetch<StandardResponse<SelectionItem[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new ApiError(
        response.message || "Failed to fetch artist selection"
      );
    }

    return {
      items: response.data || [],
      meta: response.meta || {
        page: 1,
        limit,
        total_items: 0,
        total_pages: 0,
      },
    };
  },
};
