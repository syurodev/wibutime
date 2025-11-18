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
   *
   * @example
   * ```ts
   * const result = await AuthorService.getList({ page: 1, limit: 20 });
   * ```
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
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Author[]> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to fetch authors");
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
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tải danh sách tác giả: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Get author by ID
   *
   * @example
   * ```ts
   * const author = await AuthorService.getById("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async getById(id: string): Promise<Author> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to fetch author");
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tải thông tin tác giả: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Create new author
   *
   * @example
   * ```ts
   * const author = await AuthorService.create({
   *   name: "Tân Tác Giả",
   *   biography: "Tiểu sử tác giả"
   * });
   * ```
   */
  static async create(data: CreateAuthorRequest): Promise<Author> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/authors`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to create author");
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tạo tác giả: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Update author
   *
   * @example
   * ```ts
   * const author = await AuthorService.update("550e8400-e29b-41d4-a716-446655440000", {
   *   name: "Updated Name"
   * });
   * ```
   */
  static async update(id: string, data: UpdateAuthorRequest): Promise<Author> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Author> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to update author");
      }

      return ApiParser.parse(AuthorSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi cập nhật tác giả: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Delete author
   *
   * @example
   * ```ts
   * await AuthorService.delete("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async delete(id: string): Promise<void> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/authors/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to delete author");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi xóa tác giả: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }
}
