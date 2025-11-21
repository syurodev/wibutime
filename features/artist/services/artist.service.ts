/**
 * Artist Service - API service for artist management
 * Sử dụng centralized fetch utility với logging tập trung
 */

import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/utils/error-handler";
import { api } from "@/lib/api/utils/fetch";
import { ApiParser } from "@/lib/api/utils/parsers";
import type {
  Artist,
  ArtistQuery,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../types/artist";
import { ArtistSchema } from "../types/artist";

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
      if (query?.specialization)
        params.append("specialization", query.specialization);
      if (query?.is_verified !== undefined)
        params.append("is_verified", query.is_verified.toString());

      const url = `/artists?${params.toString()}`;
      const response = await api.get<StandardResponse<Artist[]>>(url);

      if (!isSuccessResponse(response)) {
        throw new ApiError(response.message || "Failed to fetch artists");
      }

      const items = ApiParser.parseResponseArray(ArtistSchema, response);

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

      const response = await api.get<StandardResponse<Artist>>(
        `/artists/${id}`
      );

      if (!isSuccessResponse(response)) {
        throw new ApiError(response.message || "Failed to fetch artist");
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

      const response = await api.post<StandardResponse<Artist>>(
        "/artists",
        data
      );

      if (!isSuccessResponse(response)) {
        throw new ApiError(response.message || "Failed to create artist");
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

      const response = await api.put<StandardResponse<Artist>>(
        `/artists/${id}`,
        data
      );

      if (!isSuccessResponse(response)) {
        throw new ApiError(response.message || "Failed to update artist");
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

      const response = await api.delete<StandardResponse>(`/artists/${id}`);

      if (!isSuccessResponse(response)) {
        throw new ApiError(response.message || "Failed to delete artist");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Lỗi khi xóa hoạ sĩ");
    }
  }
}
