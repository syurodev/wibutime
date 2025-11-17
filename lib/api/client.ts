/**
 * API Client - Centralized fetch wrapper with authentication and error handling
 */

import { API_CONFIG } from "./config";
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  ValidationError,
  type StandardResponse,
} from "./types";

/**
 * Request options extending native fetch options
 */
export interface ApiRequestOptions extends RequestInit {
  /**
   * Disable automatic authentication header injection
   */
  skipAuth?: boolean;
  /**
   * Custom base URL (overrides config)
   */
  baseURL?: string;
  /**
   * Next.js specific options
   */
  next?: NextFetchRequestConfig;
}

/**
 * Next.js fetch request config
 */
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Main API client class
 */
class ApiClient {
  private readonly baseURL: string;

  constructor(baseURL: string = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Build full URL from endpoint
   */
  private buildURL(endpoint: string, baseURL?: string): string {
    const base = baseURL || this.baseURL;
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  }

  /**
   * Build request headers
   * Note: For authentication, pass the Authorization header in options.headers
   * Client-side: Get token from useAuth() hook
   * Server-side: Get token from getSession() in lib/auth/session.ts
   */
  private async buildHeaders(
    options: ApiRequestOptions = {}
  ): Promise<HeadersInit> {
    const headers = new Headers(options.headers || API_CONFIG.headers);
    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(
    response: Response
  ): Promise<StandardResponse<T>> {
    // Handle network errors
    if (!response.ok && response.status === 0) {
      throw new NetworkError();
    }

    // Parse JSON response
    let data: StandardResponse<T>;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(
        "Failed to parse response",
        "PARSE_ERROR",
        response.status
      );
    }

    // Handle error responses based on status code
    if (!response.ok) {
      const message = data.message || "An error occurred";
      const code = data.code;

      switch (response.status) {
        case 401:
          throw new AuthenticationError(message, code);
        case 403:
          throw new AuthorizationError(message, code);
        case 404:
          throw new NotFoundError(message, code);
        case 422:
          throw new ValidationError(message, code);
        default:
          throw new ApiError(message, code, response.status, data);
      }
    }

    return data;
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<StandardResponse<T>> {
    const url = this.buildURL(endpoint, options.baseURL);
    const headers = await this.buildHeaders(options);

    // Merge options
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      signal: options.signal,
      next: options.next,
    };

    try {
      const response = await fetch(url, fetchOptions);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Re-throw ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle fetch errors (network, CORS, etc.)
      if (error instanceof TypeError) {
        throw new NetworkError(error.message);
      }

      // Handle abort errors
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request cancelled", "CANCELLED", 0);
      }

      // Generic error
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        "UNKNOWN_ERROR"
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Create a new API client with custom base URL
 */
export function createApiClient(baseURL: string): ApiClient {
  return new ApiClient(baseURL);
}
