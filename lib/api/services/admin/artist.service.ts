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
 * Artist Service Class
 */
export class ArtistService {
  /**
   * Get list of artists with pagination
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
      const res = await fetchWithErrorHandling(url);

      const response: StandardResponse<Artist[]> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch artists",
          res.status
        );
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
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tải danh sách hoạ sĩ");
    }
  }

  /**
   * Get artist by ID
   */
  static async getById(id: string): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
      const res = await fetchWithErrorHandling(url);

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to fetch artist",
          res.status
        );
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tải thông tin hoạ sĩ");
    }
  }

  /**
   * Create new artist
   */
  static async create(data: CreateArtistRequest): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists`;
      const res = await fetchWithErrorHandling(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to create artist",
          res.status
        );
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi tạo hoạ sĩ");
    }
  }

  /**
   * Update artist
   */
  static async update(id: string, data: UpdateArtistRequest): Promise<Artist> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
      const res = await fetchWithErrorHandling(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response: StandardResponse<Artist> = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to update artist",
          res.status
        );
      }

      return ApiParser.parse(ArtistSchema, response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi cập nhật hoạ sĩ");
    }
  }

  /**
   * Delete artist
   */
  static async delete(id: string): Promise<void> {
    try {
      await mockDelay();

      const url = `${API_BASE_URL}/artists/${id}`;
      const res = await fetchWithErrorHandling(url, {
        method: "DELETE",
      });

      const response: StandardResponse = await res.json();

      if (!isSuccessResponse(response)) {
        throw new ApiError(
          response.message || "Failed to delete artist",
          res.status
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi xóa hoạ sĩ");
    }
  }
}
