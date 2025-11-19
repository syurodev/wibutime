/**
 * User Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { cache } from "react";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import {
  UserSettingsSchema,
  UserSettingsUtils,
  type UserSettings,
} from "@/lib/api/models/user/user-settings";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse } from "@/lib/api/types";

/**
 * Get user settings
 * Falls back to default settings if not found
 *
 * @example
 * const settings = await getUserSettings()
 */
export const getUserSettings = cache(async (): Promise<UserSettings> => {
  const url = endpoint("user", "settings");

  const response = await serverApi.get(url, {
    next: {
      revalidate: 60, // Cache 1 minute
      tags: ["user-settings"],
    },
  });

  if (!isSuccessResponse(response)) {
    // Return default settings on error
    return UserSettingsUtils.createDefault();
  }

  return ApiParser.parse(UserSettingsSchema, response);
});
