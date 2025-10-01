import { PaginatedResponse, StandardResponse } from "@/lib/types/api";
import { apiClient } from "../client";
import { CharactersV1Endpoint } from "./characters-endpoint.v1";
import { Character } from "./characters.model";
import {
    CreateCharacterRequest,
    ListCharactersRequest,
    UpdateCharacterRequest,
    validateCreateCharacterRequest,
    validateListCharactersRequest,
    validateUpdateCharacterRequest
} from "./characters.request";

export class CharactersApi {
    /**
     * Get paginated list of characters (public endpoint)
     */
    static async getCharacters(
        params?: ListCharactersRequest,
    ): Promise<StandardResponse<PaginatedResponse<Character>>> {
        // Validate request parameters
        const validatedParams = params ? validateListCharactersRequest(params) : {};

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
            ? `${CharactersV1Endpoint.getList}?${searchParams.toString()}`
            : CharactersV1Endpoint.getList;

        const response = await apiClient.getPaginated<any>(url);

        // Transform response data to Character instances
        if (response.success && response.data.data) {
            response.data.data = response.data.data.map((item: any) => Character.fromResponse(item));
        }

        return response as StandardResponse<PaginatedResponse<Character>>;
    }

    /**
     * Get character by ID (public endpoint)
     */
    static async getCharacterById(
        id: string | number,
    ): Promise<StandardResponse<Character>> {
        const response = await apiClient.get<any>(CharactersV1Endpoint.getById(id));

        // Transform response data to Character instance
        if (response.success && response.data) {
            response.data = Character.fromResponse(response.data);
        }

        return response as StandardResponse<Character>;
    }

    /**
     * Create new character (admin only)
     */
    static async createCharacter(
        data: CreateCharacterRequest,
    ): Promise<StandardResponse<Character>> {
        // Validate request data
        const validatedData = validateCreateCharacterRequest(data);

        const response = await apiClient.post<any>(CharactersV1Endpoint.create, validatedData);

        // Transform response data to Character instance
        if (response.success && response.data) {
            response.data = Character.fromResponse(response.data);
        }

        return response as StandardResponse<Character>;
    }

    /**
     * Update character by ID (admin only)
     */
    static async updateCharacter(
        id: string | number,
        data: UpdateCharacterRequest,
    ): Promise<StandardResponse<Character>> {
        // Validate request data
        const validatedData = validateUpdateCharacterRequest(data);

        const response = await apiClient.put<any>(CharactersV1Endpoint.update(id), validatedData);

        // Transform response data to Character instance
        if (response.success && response.data) {
            response.data = Character.fromResponse(response.data);
        }

        return response as StandardResponse<Character>;
    }

    /**
     * Delete character by ID (admin only)
     */
    static async deleteCharacter(
        id: string | number,
    ): Promise<StandardResponse<null>> {
        return apiClient.delete<null>(CharactersV1Endpoint.delete(id));
    }
}

// Export individual functions for convenience
export const {
    getCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
} = CharactersApi;

// Re-export types and models for convenience
export { Character } from "./characters.model";
export type { CreateCharacterRequest, ListCharactersRequest, UpdateCharacterRequest } from "./characters.request";