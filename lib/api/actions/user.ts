"use server";

/**
 * User Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { updateTag } from "next/cache";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import {
  UserSettingsSchema,
  type UserSettings,
} from "@/lib/api/models/user/user-settings";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";

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
