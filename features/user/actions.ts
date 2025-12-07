"use server";

/**
 * User Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
  UserProfileSchema,
  UserSettingsSchema,
  type UserSettings,
} from "./types";

/**
 * Update user settings
 *
 * @example
 * const updated = await updateUserSettings({ theme: "dark" })
 */
export async function updateUserSettings(
  data: Partial<UserSettings>
): Promise<UserSettings> {
  const url = endpoint("user", "settings");

  const response = await serverApi.patch<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update settings");
  }

  // Immediately expire user settings cache
  updateTag("user-settings");

  return ApiParser.parse(UserSettingsSchema, response);
}

/**
 * Reset user settings to defaults
 *
 * @example
 * const reset = await resetUserSettings()
 */
export async function resetUserSettings(): Promise<UserSettings> {
  const url = endpoint("user", "settings", "reset");

  const response = await serverApi.post<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to reset settings");
  }

  // Immediately expire user settings cache
  updateTag("user-settings");

  return ApiParser.parse(UserSettingsSchema, response);
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  const url = endpoint("users", "me", "profile");

  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update profile");
  }

  updateTag("user-profile");
  return ApiParser.parse(UserProfileSchema, response);
}

/**
 * Change user password
 */
export async function changeUserPassword(
  data: ChangePasswordRequest
): Promise<void> {
  const url = endpoint("users", "me", "security", "password");
  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    // Pass specific error code/message to client if possible
    // We throw the code as the error message if usually that's what we want to check
    // Or we format it like "CODE: Message"
    const errorMsg = response.code
      ? `${response.code}: ${response.message}`
      : response.message;
    throw new Error(errorMsg || "Failed to change password");
  }
}

/**
 * Revoke a session
 */
export async function revokeUserSession(sessionId: string): Promise<void> {
  const url = endpoint("users", "me", "sessions", sessionId);
  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to revoke session");
  }

  updateTag("user-sessions");
}
