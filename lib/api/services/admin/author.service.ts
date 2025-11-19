/**
 * Author Service - API service for author management
 * Sử dụng centralized fetch utility với logging tập trung
 */

import type {
  Author,
  AuthorQuery,
  CreateAuthorRequest,
  UpdateAuthorRequest,
} from "../../models/admin/author";
import { AuthorArraySchema, AuthorSchema } from "../../models/admin/author";
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
 * Author Service Class
 */
export class AuthorService {
  /**
   * Get list of authors with pagination
   */
  static async getList(query?: Partial<AuthorQuery>): Promise<{
    items: Author[];
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
      if (query?.is_verified !== undefined)
        params.append("is_verified", query.is_verified.toString());

      const url = `/authors?${params.toString()}`;
      const response = await api.get<StandardResponse<Author[]>>(url);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch authors"
        );
      }

      const items = ApiParser.parseResponseArray(AuthorArraySchema, response);

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
      throw new ApiError("Lỗi khi tải danh sách tác giả");
    }
  }

  /**
   * Get author by ID
   */
  static async getById(id: string): Promise<Author> {
    try {
      await mockDelay();

      const response = await api.get<StandardResponse<Author>>(`/authors/${id}`);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch author"
        );
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tải thông tin tác giả");
    }
  }

  /**
   * Create new author
   */
  static async create(data: CreateAuthorRequest): Promise<Author> {
    try {
      await mockDelay();

      const response = await api.post<StandardResponse<Author>>("/authors", data);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to create author"
        );
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tạo tác giả");
    }
  }

  /**
   * Update author
   */
  static async update(id: string, data: UpdateAuthorRequest): Promise<Author> {
    try {
      await mockDelay();

      const response = await api.put<StandardResponse<Author>>(
        `/authors/${id}`,
        data
      );

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to update author"
        );
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi cập nhật tác giả");
    }
  }

  /**
   * Delete author
   */
  static async delete(id: string): Promise<void> {
    try {
      await mockDelay();

      const response = await api.delete<StandardResponse>(`/authors/${id}`);

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to delete author"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi xóa tác giả");
    }
  }
}
