"use client";

/**
 * User Settings Client Hook/Service - Client-side API calls for user settings
 */

import type { StandardResponse } from "@/lib/api/types";
import { isSuccessResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { api } from "@/lib/api/utils/fetch";
import type { UserSettings } from "../types";

export const UserSettingsService = {
  /**
   * Get user settings
   */
  async getSettings(): Promise<UserSettings> {
    const url = endpoint("users", "me", "settings");
    const response = await api.get<StandardResponse<UserSettings>>(url, {
      skipAuthRedirect: true, // Don't redirect to /unauthorized on 401
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch user settings");
    }

    return response.data!;
  },

  /**
   * Update user settings
   */
  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    const url = endpoint("users", "me", "settings");
    const response = await api.patch<StandardResponse<UserSettings>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update user settings");
    }

    return response.data!;
  },
};
