/**
 * Base User Model - Zod Schema
 * Safe type generation + runtime validation với default values
 */

import { z } from "zod";

/**
 * BaseUser Zod Schema
 * Flexible với default values cho missing fields
 */
export const BaseUserSchema = z.object({
  id: z.string(),
  display_name: z.string().default("Unknown User"),
  username: z.string().default("unknown"),
  avatar_url: z.string().default(""),
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

/**
 * TypeScript type tự động generate từ schema
 */
export type BaseUser = z.infer<typeof BaseUserSchema>;

/**
 * Utilities for BaseUser
 */
export const BaseUserUtils = {
  /**
   * Safe parse user data từ API
   */
  parse(data: unknown): BaseUser {
    return BaseUserSchema.parse(data);
  },

  /**
   * Safe parse với fallback
   */
  safeParse(data: unknown): BaseUser | null {
    const result = BaseUserSchema.safeParse(data);
    return result.success ? result.data : null;
  },

  /**
   * Create default user
   */
  createDefault(overrides?: Partial<BaseUser>): BaseUser {
    return BaseUserSchema.parse({
      id: crypto.randomUUID(),
      ...overrides,
    });
  },

  /**
   * Format display name
   */
  getDisplayName(user: BaseUser): string {
    return user.display_name || user.username || "Unknown User";
  },
};
