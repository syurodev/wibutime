import { PaginatedResponse, StandardResponse } from "@/lib/types/api";
import { apiClient } from "../client";
import { GenresV1Endpoint } from "./genres-endpoint.v1";
import { Genre } from "./genres.model";
import {
    CreateGenreRequest,
    ListGenresRequest,
    UpdateGenreRequest,
    validateCreateGenreRequest,
    validateListGenresRequest,
    validateUpdateGenreRequest,
} from "./genres.request";

export class GenresApi {
    /**
     * Get paginated list of genres (public endpoint)
     */
    static async getGenres(
        params?: ListGenresRequest,
    ): Promise<StandardResponse<PaginatedResponse<Genre>>> {
        // Validate request parameters
        const validatedParams = params ? validateListGenresRequest(params) : {};

        const searchParams = new URLSearchParams();

        if (validatedParams.page) {
            searchParams.append("page", validatedParams.page.toString());
        }
        if (validatedParams.page_size) {
            searchParams.append(
                "page_size",
                validatedParams.page_size.toString(),
            );
        }
        if (validatedParams.search) {
            searchParams.append("search", validatedParams.search);
        }

        const url = searchParams.toString()
            ? `${GenresV1Endpoint.getList}?${searchParams.toString()}`
            : GenresV1Endpoint.getList;

        const response = await apiClient.getPaginated<any>(url);

        // Transform response data to Genre instances
        if (response.success && response.data.data) {
            response.data.data = response.data.data.map((item: any) =>
                Genre.fromResponse(item),
            );
        }

        return response as StandardResponse<PaginatedResponse<Genre>>;
    }

    /**
     * Get genre by ID (public endpoint)
     */
    static async getGenreById(
        id: string | number,
    ): Promise<StandardResponse<Genre>> {
        const response = await apiClient.get<any>(GenresV1Endpoint.getById(id));

        // Transform response data to Genre instance
        if (response.success && response.data) {
            response.data = Genre.fromResponse(response.data);
        }

        return response as StandardResponse<Genre>;
    }

    /**
     * Create new genre (admin only)
     */
    static async createGenre(
        data: CreateGenreRequest,
    ): Promise<StandardResponse<Genre>> {
        // Validate request data
        const validatedData = validateCreateGenreRequest(data);

        const response = await apiClient.post<any>(
            GenresV1Endpoint.create,
            validatedData,
        );

        // Transform response data to Genre instance
        if (response.success && response.data) {
            response.data = Genre.fromResponse(response.data);
        }

        return response as StandardResponse<Genre>;
    }

    /**
     * Update genre by ID (admin only)
     */
    static async updateGenre(
        id: string | number,
        data: UpdateGenreRequest,
    ): Promise<StandardResponse<Genre>> {
        // Validate request data
        const validatedData = validateUpdateGenreRequest(data);

        const response = await apiClient.put<any>(
            GenresV1Endpoint.update(id),
            validatedData,
        );

        // Transform response data to Genre instance
        if (response.success && response.data) {
            response.data = Genre.fromResponse(response.data);
        }

        return response as StandardResponse<Genre>;
    }

    /**
     * Delete genre by ID (admin only)
     */
    static async deleteGenre(
        id: string | number,
    ): Promise<StandardResponse<null>> {
        return apiClient.delete<null>(GenresV1Endpoint.delete(id));
    }
}

// Export individual functions for convenience
export const {
    getGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
} = GenresApi;

// Re-export types and models for convenience
export { Genre } from "./genres.model";
export type {
    CreateGenreRequest,
    ListGenresRequest,
    UpdateGenreRequest,
} from "./genres.request";
