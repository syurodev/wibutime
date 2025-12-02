import { isSuccessResponse, type StandardResponse } from "../../types";
import { endpoint } from "../../utils/endpoint";
import { ApiError } from "../../utils/error-handler";
import { apiFetch } from "../../utils/fetch";

export interface AuthorSelection {
  id: string;
  name: string;
}

export const AuthorService = {
  getSelection: async (search?: string, page = 1, limit = 20) => {
    const url = endpoint("authors", "selection", { search, page, limit });

    // Parse theo StandardResponse từ backend
    const response = await apiFetch<StandardResponse<AuthorSelection[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new ApiError(
        response.message || "Failed to fetch author selection"
      );
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
