import { PaginatedResponse, StandardResponse } from "@/lib/types/api";
import { apiClient } from "../client";
import { CreatorsV1Endpoint } from "./creators-endpoint.v1";
import { Creator } from "./creators.model";
import {
    CreateCreatorRequest,
    ListCreatorsRequest,
    UpdateCreatorRequest,
    validateCreateCreatorRequest,
    validateListCreatorsRequest,
    validateUpdateCreatorRequest
} from "./creators.request";

export class CreatorsApi {
    /**
     * Get paginated list of creators (public endpoint)
     */
    static async getCreators(
        params?: ListCreatorsRequest,
    ): Promise<StandardResponse<PaginatedResponse<Creator>>> {
        // Validate request parameters
        const validatedParams = params ? validateListCreatorsRequest(params) : {};

        const searchParams = new URLSearchParams();

        if (validatedParams.page) {
            searchParams.append("page", validatedParams.page.toString());
        }
        if (validatedParams.page_size) {
            searchParams.append("page_size", validatedParams.page_size.toString());
        }
        if (validatedParams.search) {
            searchParams.append("search", validatedParams.search);
        }

        const url = searchParams.toString()
            ? `${CreatorsV1Endpoint.getList}?${searchParams.toString()}`
            : CreatorsV1Endpoint.getList;

        const response = await apiClient.getPaginated<any>(url);

        // Transform response data to Creator instances
        if (response.success && response.data.data) {
            response.data.data = response.data.data.map((item: any) => Creator.fromResponse(item));
        }

        return response as StandardResponse<PaginatedResponse<Creator>>;
    }

    /**
     * Get creator by ID (public endpoint)
     */
    static async getCreatorById(
        id: string | number,
    ): Promise<StandardResponse<Creator>> {
        const response = await apiClient.get<any>(CreatorsV1Endpoint.getById(id));

        // Transform response data to Creator instance
        if (response.success && response.data) {
            response.data = Creator.fromResponse(response.data);
        }

        return response as StandardResponse<Creator>;
    }

    /**
     * Create new creator (admin only)
     */
    static async createCreator(
        data: CreateCreatorRequest,
    ): Promise<StandardResponse<Creator>> {
        // Validate request data
        const validatedData = validateCreateCreatorRequest(data);

        const response = await apiClient.post<any>(CreatorsV1Endpoint.create, validatedData);

        // Transform response data to Creator instance
        if (response.success && response.data) {
            response.data = Creator.fromResponse(response.data);
        }

        return response as StandardResponse<Creator>;
    }

    /**
     * Update creator by ID (admin only)
     */
    static async updateCreator(
        id: string | number,
        data: UpdateCreatorRequest,
    ): Promise<StandardResponse<Creator>> {
        // Validate request data
        const validatedData = validateUpdateCreatorRequest(data);

        const response = await apiClient.put<any>(CreatorsV1Endpoint.update(id), validatedData);

        // Transform response data to Creator instance
        if (response.success && response.data) {
            response.data = Creator.fromResponse(response.data);
        }

        return response as StandardResponse<Creator>;
    }

    /**
     * Delete creator by ID (admin only)
     */
    static async deleteCreator(
        id: string | number,
    ): Promise<StandardResponse<null>> {
        return apiClient.delete<null>(CreatorsV1Endpoint.delete(id));
    }
}

// Export individual functions for convenience
export const {
    getCreators,
    getCreatorById,
    createCreator,
    updateCreator,
    deleteCreator,
} = CreatorsApi;

// Re-export types and models for convenience
export { Creator } from "./creators.model";
export type { CreateCreatorRequest, ListCreatorsRequest, UpdateCreatorRequest } from "./creators.request";

