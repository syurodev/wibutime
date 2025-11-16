/**
 * User Settings Model - Zod Schema
 * Global user preferences với localStorage + API sync
 */

import { z } from "zod";

/**
 * UI Preferences Schema
 * Các settings cho giao diện người dùng
 */
export const UiPreferencesSchema = z.object({
  reduce_blur: z.boolean().default(false),
  auto_play_video: z.boolean().default(false),
  show_mature_content: z.boolean().default(false),
  compact_view: z.boolean().default(false),
});

export type UiPreferences = z.infer<typeof UiPreferencesSchema>;

/**
 * UserSettings Zod Schema
 * Flexible với default values cho missing fields
 */
export const UserSettingsSchema = z.object({
  user_id: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  notifications_enabled: z.boolean().default(true),
  content_filters: z.array(z.string()).default([]),
  ui_preferences: UiPreferencesSchema.default(() => ({
    reduce_blur: false,
    auto_play_video: false,
    show_mature_content: false,
    compact_view: false,
  })),
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

/**
 * TypeScript type tự động generate từ schema
 */
export type UserSettings = z.infer<typeof UserSettingsSchema>;

/**
 * Utilities for UserSettings
 */
export const UserSettingsUtils = {
  /**
   * Safe parse settings data từ API
   */
  parse(data: unknown): UserSettings {
    return UserSettingsSchema.parse(data);
  },

  /**
   * Safe parse với fallback
   */
  safeParse(data: unknown): UserSettings | null {
    const result = UserSettingsSchema.safeParse(data);
    return result.success ? result.data : null;
  },

  /**
   * Create default settings
   */
  createDefault(overrides?: Partial<UserSettings>): UserSettings {
    return UserSettingsSchema.parse({
      ...overrides,
    });
  },

  /**
   * Merge settings với defaults
   */
  merge(
    current: Partial<UserSettings>,
    updates: Partial<UserSettings>
  ): UserSettings {
    return UserSettingsSchema.parse({
      ...current,
      ...updates,
      ui_preferences: {
        ...current.ui_preferences,
        ...updates.ui_preferences,
      },
      updated_at: new Date().toISOString(),
    });
  },
};
