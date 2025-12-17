/**
 * User Settings Model - Zod Schema
 * Global user preferences với localStorage + API sync
 */

import { z } from "zod";

/**
 * Glass Effect types
 */
export const GlassEffectValues = ["normal", "reduce", "liquid"] as const;
export type GlassEffect = (typeof GlassEffectValues)[number];

/**
 * UI Preferences Schema
 * Các settings cho giao diện người dùng
 */
export const UiPreferencesSchema = z.object({
  glass_effect: z.enum(GlassEffectValues).default("normal"),
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
    glass_effect: "normal" as GlassEffect,
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

/**
 * User Profile Schema
 */
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  bio: z.any().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  full_name: z.string().optional(),
  display_name: z.string().optional(),
  bio: z.any().optional(),
  avatar_url: z.string().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

/**
 * Password Change Schema
 */
export const ChangePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z.string(),
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;

/**
 * Session Schema
 */
export const UserSessionSchema = z.object({
  id: z.string(),
  ip: z.string(),
  user_agent: z.string(),
  device: z.string(),
  client_os: z.string(),
  browser: z.string(),
  last_active: z.string(),
  current: z.boolean(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

export const UserSessionsSchema = z.array(UserSessionSchema);
export type UserSessions = z.infer<typeof UserSessionsSchema>;
