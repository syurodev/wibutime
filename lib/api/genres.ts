import { StandardResponse } from "@/types/api";

export interface Genre {
  id: string;
  name: string;
  anime_count: number;
  manga_count: number;
  novel_count: number;
}

export interface CreateGenreRequest {
  name: string;
}

export interface UpdateGenreRequest {
  name: string;
}

/**
 * Fetch all genres from the catalog service
 */
export async function getGenres(): Promise<Genre[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_API_URL}/api/v1/genres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`);
  }

  const result: StandardResponse<Genre[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch genres');
  }

  return result.data || [];
}

/**
 * Create a new genre
 */
export async function createGenre(data: CreateGenreRequest, accessToken?: string): Promise<Genre> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_API_URL}/api/v1/genres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create genre: ${response.statusText}`);
  }

  const result: StandardResponse<Genre> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to create genre');
  }

  return result.data!;
}

/**
 * Update an existing genre
 */
export async function updateGenre(id: string, data: UpdateGenreRequest, accessToken?: string): Promise<Genre> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_API_URL}/api/v1/genres/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update genre: ${response.statusText}`);
  }

  const result: StandardResponse<Genre> = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to update genre');
  }

  return result.data!;
}

/**
 * Delete a genre
 */
export async function deleteGenre(id: string, accessToken?: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_API_URL}/api/v1/genres/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete genre: ${response.statusText}`);
  }

  const result: StandardResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to delete genre');
  }
}