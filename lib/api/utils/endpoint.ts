/**
 * Endpoint Builder Utility
 * Builds full API URLs from base URL + version + path + params
 */

import { DEFAULT_API_VERSION } from "@/lib/constants/default";
import { API_CONFIG } from "../config";

/**
 * Build full API endpoint URL
 *
 * @param path - API path (e.g., "users", "genres", "content")
 * @param params - Path segments (strings/numbers) and/or query params (object)
 *
 * @example
 * // Simple path
 * endpoint("users")
 * // → "http://localhost:8080/api/v1/users"
 *
 * @example
 * // With path parameter
 * endpoint("users", "123")
 * // → "http://localhost:8080/api/v1/users/123"
 *
 * @example
 * // With query parameters
 * endpoint("users", { page: 1, limit: 20 })
 * // → "http://localhost:8080/api/v1/users?page=1&limit=20"
 *
 * @example
 * // With path + query parameters
 * endpoint("users", "123", { include: "posts" })
 * // → "http://localhost:8080/api/v1/users/123?include=posts"
 *
 * @example
 * // Multiple path segments
 * endpoint("users", "123", "posts", "456")
 * // → "http://localhost:8080/api/v1/users/123/posts/456"
 */
export function endpoint(
  path: string,
  ...params: (string | number | Record<string, any>)[]
): string {
  // Get base URL and version
  const base = API_CONFIG.baseURL; // e.g., "http://localhost:8080/api"
  const version = DEFAULT_API_VERSION; // e.g., "v1"

  // Remove leading/trailing slashes from path
  const cleanPath = path.replace(/^\/+|\/+$/g, "");

  // Build base URL with version and path
  let url = base;
  if (!base.endsWith(`/${version}`)) {
    url += `/${version}`;
  }
  url += `/${cleanPath}`;

  // Separate path params (strings/numbers) from query params (objects)
  const pathParams: (string | number)[] = [];
  let queryParams: Record<string, any> | undefined;

  for (const param of params) {
    if (typeof param === "string" || typeof param === "number") {
      pathParams.push(param);
    } else if (typeof param === "object" && !Array.isArray(param)) {
      queryParams = param;
    }
  }

  // Append path parameters
  if (pathParams.length > 0) {
    url += "/" + pathParams.join("/");
  }

  // Append query parameters
  if (queryParams) {
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      // Skip undefined and null values
      if (value !== undefined && value !== null) {
        // Handle arrays
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

/**
 * Type-safe endpoint builder with predefined paths
 * Use this for autocomplete and type safety
 */
export const endpoints = {
  // User endpoints
  users: (params?: Record<string, any>) => endpoint("users", params || {}),
  user: (id: string, params?: Record<string, any>) =>
    endpoint("users", id, params || {}),
  userSettings: () => endpoint("user", "settings"),

  // Content endpoints
  content: (params?: Record<string, any>) => endpoint("content", params || {}),
  contentById: (id: string) => endpoint("content", id),
  contentTrending: (params?: Record<string, any>) =>
    endpoint("content", "trending", params || {}),
  contentLatest: (params?: Record<string, any>) =>
    endpoint("content", "latest", params || {}),
  contentPopular: (params?: Record<string, any>) =>
    endpoint("content", "popular", params || {}),

  // Genre endpoints
  genres: (params?: Record<string, any>) => endpoint("genres", params || {}),
  genre: (id: string) => endpoint("genres", id),

  // Author endpoints
  authors: (params?: Record<string, any>) => endpoint("authors", params || {}),
  author: (id: string) => endpoint("authors", id),

  // Artist endpoints
  artists: (params?: Record<string, any>) => endpoint("artists", params || {}),
  artist: (id: string) => endpoint("artists", id),

  // History endpoints
  history: (params?: Record<string, any>) => endpoint("history", params || {}),
  historyById: (id: string) => endpoint("history", id),

  // Community endpoints
  community: (params?: Record<string, any>) =>
    endpoint("community", params || {}),
  communityById: (id: string) => endpoint("community", id),
} as const;
