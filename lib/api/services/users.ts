/**
 * Users Service - Example API service with model mapping
 */

import { apiClient } from "../client";
import { User, type UserRaw } from "../models/user";
import { isSuccessResponse, type PaginatedResponse } from "../types";

/**
 * Query parameters for listing users
 */
export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
}

/**
 * Parameters for creating a user
 */
export interface CreateUserParams {
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  role?: string;
}

/**
 * Parameters for updating a user
 */
export interface UpdateUserParams {
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  is_active?: boolean;
}

/**
 * Users Service Class
 */
export class UsersService {
  /**
   * Get all users with pagination
   *
   * @example
   * ```ts
   * const result = await UsersService.list({ page: 1, limit: 20 });
   * console.log(result.items); // Array of User models
   * console.log(result.meta.total_items);
   * ```
   */
  static async list(
    params?: ListUsersParams
  ): Promise<PaginatedResponse<User>> {
    // Build query string
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.role) searchParams.set("role", params.role);
    if (params?.is_active !== undefined)
      searchParams.set("is_active", params.is_active.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/users?${query}` : "/users";

    // Make API request with caching
    const response = await apiClient.get<UserRaw[]>(endpoint, {
      next: {
        revalidate: 60, // Cache for 60 seconds
        tags: ["users"], // Tag for revalidation
      },
    });

    // Validate response
    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch users");
    }

    // Map raw data to User models
    const users = User.fromApiArray(response.data);

    return {
      items: users,
      meta: response.meta || {
        page: 1,
        limit: 10,
        total_items: users.length,
        total_pages: 1,
      },
    };
  }

  /**
   * Get user by ID
   *
   * @example
   * ```ts
   * const user = await UsersService.getById("123");
   * console.log(user.fullName);
   * console.log(user.isAdmin);
   * ```
   */
  static async getById(id: string): Promise<User> {
    const response = await apiClient.get<UserRaw>(`/users/${id}`, {
      next: {
        revalidate: 30, // Cache for 30 seconds
        tags: [`user-${id}`],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch user");
    }

    return User.fromApi(response.data);
  }

  /**
   * Get current authenticated user
   *
   * @example
   * ```ts
   * const currentUser = await UsersService.me();
   * console.log(currentUser.email);
   * ```
   */
  static async me(): Promise<User> {
    const response = await apiClient.get<UserRaw>("/users/me", {
      next: {
        revalidate: 0, // Don't cache (always fresh)
        tags: ["current-user"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch current user");
    }

    return User.fromApi(response.data);
  }

  /**
   * Create a new user
   * Note: This should typically be called from a Server Action
   *
   * @example
   * ```ts
   * const newUser = await UsersService.create({
   *   email: "user@example.com",
   *   password: "secret123",
   *   first_name: "John",
   *   last_name: "Doe"
   * });
   * ```
   */
  static async create(data: CreateUserParams): Promise<User> {
    const response = await apiClient.post<UserRaw>("/users", data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to create user");
    }

    return User.fromApi(response.data);
  }

  /**
   * Update user by ID
   * Note: This should typically be called from a Server Action
   *
   * @example
   * ```ts
   * const updatedUser = await UsersService.update("123", {
   *   first_name: "Jane"
   * });
   * ```
   */
  static async update(id: string, data: UpdateUserParams): Promise<User> {
    const response = await apiClient.patch<UserRaw>(`/users/${id}`, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update user");
    }

    return User.fromApi(response.data);
  }

  /**
   * Delete user by ID
   * Note: This should typically be called from a Server Action
   *
   * @example
   * ```ts
   * await UsersService.delete("123");
   * ```
   */
  static async delete(id: string): Promise<void> {
    const response = await apiClient.delete(`/users/${id}`);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to delete user");
    }
  }

  /**
   * Search users by query
   *
   * @example
   * ```ts
   * const results = await UsersService.search("john");
   * ```
   */
  static async search(query: string): Promise<User[]> {
    const response = await apiClient.get<UserRaw[]>(
      `/users/search?q=${encodeURIComponent(query)}`,
      {
        next: {
          revalidate: 120, // Cache search results for 2 minutes
        },
      }
    );

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to search users");
    }

    return User.fromApiArray(response.data);
  }
}
