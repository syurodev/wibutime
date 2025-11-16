/**
 * User Settings Service - API integration for user preferences
 */

import type { UserSettings } from "@/lib/api/models/user/user-settings";
import {
  UserSettingsSchema,
  UserSettingsUtils,
} from "@/lib/api/models/user/user-settings";
import { apiClient } from "@/lib/api/client";
import {
  isSuccessResponse,
  type StandardResponse,
} from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";

// Mock delay for development
const mockDelay = async (min = 100, max = 300) => {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Toggle between mock and real API
const USE_MOCK = true; // Set to false when backend is ready

export class UserSettingsService {
  /**
   * Get user settings from API
   * Falls back to default settings if not found
   */
  static async getSettings(): Promise<UserSettings> {
    if (USE_MOCK) {
      await mockDelay();

      // Return mock default settings
      const response: StandardResponse<UserSettings> = {
        success: true,
        message: "Settings fetched successfully",
        data: UserSettingsUtils.createDefault(),
      };

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to fetch settings");
      }

      return ApiParser.parse(UserSettingsSchema, response);
    }

    // Real API call (when backend ready)
    const response = await apiClient.get<StandardResponse<UserSettings>>(
      "/user/settings"
    );

    if (!isSuccessResponse(response)) {
      // Return default settings on error
      return UserSettingsUtils.createDefault();
    }

    return ApiParser.parse(UserSettingsSchema, response);
  }

  /**
   * Update user settings via API
   * Merges with existing settings
   */
  static async updateSettings(
    settings: Partial<UserSettings>
  ): Promise<UserSettings> {
    if (USE_MOCK) {
      await mockDelay();

      // Simulate API update
      const response: StandardResponse<UserSettings> = {
        success: true,
        message: "Settings updated successfully",
        data: {
          ...UserSettingsUtils.createDefault(),
          ...settings,
          updated_at: new Date().toISOString(),
        } as UserSettings,
      };

      if (!isSuccessResponse(response)) {
        throw new Error(response.message || "Failed to update settings");
      }

      return ApiParser.parse(UserSettingsSchema, response);
    }

    // Real API call (when backend ready)
    const response = await apiClient.patch<StandardResponse<UserSettings>>(
      "/user/settings",
      settings
    );

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update settings");
    }

    return ApiParser.parse(UserSettingsSchema, response);
  }

  /**
   * Reset settings to defaults
   */
  static async resetSettings(): Promise<UserSettings> {
    const defaultSettings = UserSettingsUtils.createDefault();
    return this.updateSettings(defaultSettings);
  }
}
