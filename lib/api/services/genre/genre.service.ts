import { isSuccessResponse, type StandardResponse } from "../../types";
import { endpoint } from "../../utils/endpoint";
import { ApiError } from "../../utils/error-handler";
import { apiFetch } from "../../utils/fetch";

export interface GenreSelection {
  id: string;
  name: string;
}

export const GenreService = {
  getSelection: async (search?: string, page = 1, limit = 20) => {
    const url = endpoint("genres", "selection", { search, page, limit });

    // Parse theo StandardResponse từ backend
    const response = await apiFetch<StandardResponse<GenreSelection[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new ApiError(response.message || "Failed to fetch genre selection");
    }

    return {
      items: response.data || [],
      meta: response.meta || {
        page: 1,
        limit: 20,
        total_items: 0,
        total_pages: 0,
      },
    };
  },
};
