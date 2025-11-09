/**
 * User Server Actions - Example mutations using Server Actions
 */

"use server";

import { updateTag } from "next/cache";
import { UsersService } from "../api/services/users";
import type { CreateUserParams, UpdateUserParams } from "../api/services/users";
import { ApiError, ValidationError } from "../api/types";

/**
 * Server Action result type
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * Create a new user
 *
 * @example Usage in a form:
 * ```tsx
 * "use client";
 * import { createUser } from "@/lib/actions/user-actions";
 *
 * export function CreateUserForm() {
 *   async function handleSubmit(formData: FormData) {
 *     const result = await createUser({
 *       email: formData.get("email") as string,
 *       password: formData.get("password") as string,
 *       first_name: formData.get("firstName") as string,
 *       last_name: formData.get("lastName") as string,
 *     });
 *
 *     if (result.success) {
 *       // Handle success
 *       console.log("User created:", result.data);
 *     } else {
 *       // Handle error
 *       console.error(result.error);
 *     }
 *   }
 *
 *   return <form action={handleSubmit}>...</form>;
 * }
 * ```
 */
export async function createUser(
  data: CreateUserParams
): Promise<ActionResult<{ id: string; email: string }>> {
  try {
    const user = await UsersService.create(data);

    // Immediately expire users cache
    updateTag("users");

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      error: "Failed to create user",
    };
  }
}

/**
 * Update user by ID
 *
 * @example
 * ```tsx
 * const result = await updateUser("123", {
 *   first_name: "Jane"
 * });
 * ```
 */
export async function updateUser(
  id: string,
  data: UpdateUserParams
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await UsersService.update(id, data);

    // Immediately expire caches
    updateTag(`user-${id}`);
    updateTag("users");
    updateTag("current-user");

    return {
      success: true,
      data: { id: user.id },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      error: "Failed to update user",
    };
  }
}

/**
 * Delete user by ID
 *
 * @example
 * ```tsx
 * const result = await deleteUser("123");
 * if (result.success) {
 *   router.push("/users");
 * }
 * ```
 */
export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    await UsersService.delete(id);

    // Immediately expire caches
    updateTag(`user-${id}`);
    updateTag("users");

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      error: "Failed to delete user",
    };
  }
}

/**
 * Toggle user active status
 *
 * @example
 * ```tsx
 * const result = await toggleUserActive("123");
 * ```
 */
export async function toggleUserActive(id: string): Promise<ActionResult<{ isActive: boolean }>> {
  try {
    // First get current user to check status
    const currentUser = await UsersService.getById(id);

    // Update with opposite status
    const updatedUser = await UsersService.update(id, {
      is_active: !currentUser.isActive,
    });

    // Immediately expire caches
    updateTag(`user-${id}`);
    updateTag("users");

    return {
      success: true,
      data: { isActive: updatedUser.isActive },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: false,
      error: "Failed to toggle user status",
    };
  }
}
