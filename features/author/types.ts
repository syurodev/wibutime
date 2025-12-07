/**
 * Author Types - Zod Schemas & Types
 * Consolidated from lib/api/models/admin/author.ts
 */

import { z } from "zod";

/**
 * Author Schema - Full data model
 */
export const AuthorSchema = z.object({
  // Required fields
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  slug: z.string(),

  // Optional fields
  description: z.string().max(5000, "Description too long").default(""),
  avatar_url: z.string().url().nullable().default(null),
  social_links: z.string().default("{}"), // JSON string

  // Stats
  novel_count: z.number().int().min(0).default(0),
  total_chapters: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  follower_count: z.number().int().min(0).default(0),
  is_verified: z.boolean().default(false),

  // Timestamps
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

export type Author = z.infer<typeof AuthorSchema>;

/**
 * Create Author Request Schema
 */
export const CreateAuthorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  biography: z.string().max(5000, "Biography too long").optional(),
  avatar_url: z.string().url().optional(),
  social_links: z.string().optional(),
});

export type CreateAuthorRequest = z.infer<typeof CreateAuthorSchema>;

/**
 * Update Author Request Schema
 */
export const UpdateAuthorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  biography: z.string().max(5000).optional(),
  avatar_url: z.string().url().optional(),
  social_links: z.string().optional(),
});

export type UpdateAuthorRequest = z.infer<typeof UpdateAuthorSchema>;

/**
 * Author Query Parameters Schema
 */
export const AuthorQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.enum(["name", "views", "novels", "created"]).optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  is_verified: z.boolean().optional(),
});

export type AuthorQuery = z.infer<typeof AuthorQuerySchema>;

/**
 * Array schema
 */
export const AuthorArraySchema = z.array(AuthorSchema);
