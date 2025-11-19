/**
 * Genre Service - API service for genre management
 * Sử dụng centralized fetch utility với logging tập trung
 */

import type {
    CreateGenreRequest,
    Genre,
    GenreQuery,
    UpdateGenreRequest,
} from "../../models/admin/genre";
import { GenreSchema } from "../../models/admin/genre";
import { isSuccessResponse, type StandardResponse } from "../../types";
import { ApiError } from "../../utils/error-handler";
import { api } from "../../utils/fetch";
import { ApiParser } from "../../utils/parsers";

/**
 * Simulate API delay for development
 */
async function mockDelay(min = 200, max = 500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Genre Service Class
 */
export class GenreService {
  /**
   * Get list of genres with pagination
   *
   * @example
   * ```ts
   * const result = await GenreService.getList({ page: 1, limit: 20, search: "fantasy" });
   * ```
   */
  static async getList(query?: Partial<GenreQuery>): Promise<{
    items: Genre[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> {
    try {
      await mockDelay();

      const params = new URLSearchParams();
      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.search) params.append("search", query.search);
      if (query?.sort_by) params.append("sort_by", query.sort_by);
      if (query?.sort_order) params.append("sort_order", query.sort_order);
      if (query?.active_only) params.append("active_only", "true");

      const url = `/genres?${params.toString()}`;
      const response = await api.get<StandardResponse<Genre[]>>(url);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch genres"
        );
      }

      const items = ApiParser.parseResponseArray(GenreSchema, response);

      return {
        items,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 20,
        total_items: response.meta?.total_items || items.length,
        total_pages: response.meta?.total_pages || 1,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tải danh sách thể loại");
    }
  }

  /**
   * Get genre by ID
   *
   * @example
   * ```ts
   * const genre = await GenreService.getById("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async getById(id: string): Promise<Genre> {
    try {
      await mockDelay();

      const response = await api.get<StandardResponse<Genre>>(`/genres/${id}`);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch genre"
        );
      }

      return ApiParser.parse(GenreSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tải thông tin thể loại");
    }
  }

  /**
   * Create new genre
   *
   * @example
   * ```ts
   * const genre = await GenreService.create({
   *   name: "Fantasy",
   *   description: "Fantasy genre"
   * });
   * ```
   */
  static async create(data: CreateGenreRequest): Promise<Genre> {
    try {
      await mockDelay();

      const response = await api.post<StandardResponse<Genre>>("/genres", data);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to create genre"
        );
      }

      return ApiParser.parse(GenreSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tạo thể loại");
    }
  }

  /**
   * Update genre
   *
   * @example
   * ```ts
   * const genre = await GenreService.update("550e8400-e29b-41d4-a716-446655440000", {
   *   name: "Updated Name",
   *   is_active: true
   * });
   * ```
   */
  static async update(id: string, data: UpdateGenreRequest): Promise<Genre> {
    try {
      await mockDelay();

      const response = await api.put<StandardResponse<Genre>>(
        `/genres/${id}`,
        data
      );

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to update genre"
        );
      }

      return ApiParser.parse(GenreSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi cập nhật thể loại");
    }
  }

  /**
   * Delete genre
   *
   * @example
   * ```ts
   * await GenreService.delete("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async delete(id: string): Promise<void> {
    try {
      await mockDelay();

      const response = await api.delete<StandardResponse>(`/genres/${id}`);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to delete genre"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi xóa thể loại");
    }
  }
}
