/**
 * Genre Service - API service for genre management
 * Following the same pattern as content.service.ts
 */

import type {
  CreateGenreRequest,
  Genre,
  GenreQuery,
  UpdateGenreRequest,
} from "../../models/admin/genre";
import { GenreArraySchema, GenreSchema } from "../../models/admin/genre";
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
    await mockDelay();

    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);
    if (query?.sort_by) params.append("sort_by", query.sort_by);
    if (query?.sort_order) params.append("sort_order", query.sort_order);
    if (query?.active_only) params.append("active_only", "true");

    const url = `${API_BASE_URL}/genres?${params.toString()}`;
    const res = await fetch(url);
    const response: StandardResponse<Genre[]> = await res.json();

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genres");
    }

    const items = ApiParser.parseResponseArray(GenreArraySchema, response);

    return {
      items,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
      total_items: response.meta?.total_items || items.length,
      total_pages: response.meta?.total_pages || 1,
    };
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
    await mockDelay();

    const url = `${API_BASE_URL}/genres/${id}`;
    const res = await fetch(url);
    const response: StandardResponse<Genre> = await res.json();

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genre");
    }

    return ApiParser.parse(GenreSchema, response);
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
    await mockDelay();

    const url = `${API_BASE_URL}/genres`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response: StandardResponse<Genre> = await res.json();

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to create genre");
    }

    return ApiParser.parse(GenreSchema, response);
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
    await mockDelay();

    const url = `${API_BASE_URL}/genres/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response: StandardResponse<Genre> = await res.json();

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update genre");
    }

    return ApiParser.parse(GenreSchema, response);
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
    await mockDelay();

    const url = `${API_BASE_URL}/genres/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    const response: StandardResponse = await res.json();

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to delete genre");
    }
  }
}
