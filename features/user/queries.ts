/**
 * User Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import {
  UserProfileSchema,
  UserSessionsSchema,
  UserSettingsSchema,
  UserSettingsUtils,
  type UserProfile,
  type UserSessions,
  type UserSettings,
} from "./types";

/**
 * Get user settings
 * Falls back to default settings if not found
 *
 * @example
 * const settings = await getUserSettings()
 */
export const getUserSettings = cache(async (): Promise<UserSettings> => {
  const url = endpoint("user", "settings");

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
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

/**
 * Get user profile
 */
export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const url = endpoint("users", "me", "profile");
  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 60,
      tags: ["user-profile"],
    },
  });

  if (!isSuccessResponse(response)) {
    return null;
  }

  return ApiParser.parse(UserProfileSchema, response);
});

/**
 * Get user sessions
 */
export const getUserSessions = cache(async (): Promise<UserSessions> => {
  const url = endpoint("users", "me", "sessions");
  const response = await serverApi.get<StandardResponse<unknown>>(
    url,
    {
      next: {
        revalidate: 0, // Sessions change often, maybe don't cache or short cache
        tags: ["user-sessions"],
      },
    }
  );

  if (!isSuccessResponse(response)) {
    return [];
  }

  return ApiParser.parse(UserSessionsSchema, response);
});
