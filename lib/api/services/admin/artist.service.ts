/**
 * Artist Service - API service for artist management
 * Following the same pattern as content.service.ts
 */

import type {
  Artist,
  ArtistQuery,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../../models/admin/artist";
import { ArtistArraySchema, ArtistSchema } from "../../models/admin/artist";
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
 * Artist Service Class
 */
export class ArtistService {
  /**
   * Get list of artists with pagination
   *
   * @example
   * ```ts
   * const result = await ArtistService.getList({ page: 1, limit: 20 });
   * ```
   */
  static async getList(query?: Partial<ArtistQuery>): Promise<{
    items: Artist[];
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
      if (query?.specialization) params.append("specialization", query.specialization);
      if (query?.is_verified !== undefined)
        params.append("is_verified", query.is_verified.toString());

      const url = `${API_BASE_URL}/artists?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Artist[]> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to fetch artists");
      }

      const items = ApiParser.parseResponseArray(ArtistArraySchema, response);

      return {
        items,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 20,
        total_items: response.meta?.total_items || items.length,
        total_pages: response.meta?.total_pages || 1,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tải danh sách hoạ sĩ: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Get artist by ID
   *
   * @example
   * ```ts
   * const artist = await ArtistService.getById("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async getById(id: string): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to fetch artist");
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tải thông tin hoạ sĩ: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Create new artist
   *
   * @example
   * ```ts
   * const artist = await ArtistService.create({
   *   name: "Hoạ Sĩ Mới",
   *   biography: "Tiểu sử hoạ sĩ",
   *   specialization: "illustrator"
   * });
   * ```
   */
  static async create(data: CreateArtistRequest): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists`;
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

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to create artist");
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tạo hoạ sĩ: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Update artist
   *
   * @example
   * ```ts
   * const artist = await ArtistService.update("550e8400-e29b-41d4-a716-446655440000", {
   *   name: "Updated Name",
   *   specialization: "character_designer"
   * });
   * ```
   */
  static async update(id: string, data: UpdateArtistRequest): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
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

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to update artist");
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi cập nhật hoạ sĩ: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }

  /**
   * Delete artist
   *
   * @example
   * ```ts
   * await ArtistService.delete("550e8400-e29b-41d4-a716-446655440000");
   * ```
   */
  static async delete(id: string): Promise<void> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: StandardResponse = await res.json();

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to delete artist");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi xóa hoạ sĩ: ${error.message}`);
      }
      throw new Error("Không thể kết nối đến server");
    }
  }
}
