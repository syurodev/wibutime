/**
 * Author Service - API service for author management
 * Following the same pattern as content.service.ts
 */

import type {
  Author,
  AuthorQuery,
  CreateAuthorRequest,
  UpdateAuthorRequest,
} from "../../models/admin/author";
import { AuthorArraySchema, AuthorSchema } from "../../models/admin/author";
import { isSuccessResponse, type StandardResponse } from "../../types";
import {
  ApiError,
  fetchWithErrorHandling,
} from "../../utils/error-handler";
import { ApiParser } from "../../utils/parsers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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

      const url = `${API_BASE_URL}/authors?${params.toString()}`;
      const res = await fetchWithErrorHandling(url);

      const response: StandardResponse<Author[]> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch authors",
          res.status
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

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetchWithErrorHandling(url);

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch author",
          res.status
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

      const url = `${API_BASE_URL}/authors`;
      const res = await fetchWithErrorHandling(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to create author",
          res.status
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

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetchWithErrorHandling(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to update author",
          res.status
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

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetchWithErrorHandling(url, {
        method: "DELETE",
      });

      const response: StandardResponse = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to delete author",
          res.status
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
