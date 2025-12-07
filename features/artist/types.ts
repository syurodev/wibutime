/**
 * Artist Model - Zod Schema
 * Model for artist management
 */

import { z } from "zod";

/**
 * Artist Schema - Full data model
 */
export const ArtistSchema = z.object({
  // Required fields
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  slug: z.string(),

  // Optional fields
  description: z.string().max(5000, "Description too long").default(""),
  avatar_url: z.string().url().nullable().default(null),
  social_links: z.string().default("{}"), // JSON string
  specialization: z.string().max(100).default(""),

  // Stats
  novel_count: z.number().int().min(0).default(0),
  artwork_count: z.number().int().min(0).default(0),
  follower_count: z.number().int().min(0).default(0),
  is_verified: z.boolean().default(false),

  // Timestamps
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

export type Artist = z.infer<typeof ArtistSchema>;

/**
 * Create Artist Request Schema
 */
export const CreateArtistSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  biography: z.string().max(5000, "Biography too long").optional(),
  avatar_url: z.string().url().optional(),
  social_links: z.string().optional(), // JSON string
  specialization: z.string().max(100).optional(),
});

export type CreateArtistRequest = z.infer<typeof CreateArtistSchema>;

/**
 * Update Artist Request Schema
 */
export const UpdateArtistSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name too long")
    .optional(),
  biography: z.string().max(5000, "Biography too long").optional(),
  avatar_url: z.string().url().optional(),
  social_links: z.string().optional(), // JSON string
  specialization: z.string().max(100).optional(),
});

export type UpdateArtistRequest = z.infer<typeof UpdateArtistSchema>;

/**
 * Artist Query Parameters Schema
 */
export const ArtistQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.enum(["name", "novels", "created"]).optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  specialization: z.string().optional(),
  is_verified: z.boolean().optional(),
});

export type ArtistQuery = z.infer<typeof ArtistQuerySchema>;

/**
 * Array schema
 */
export const ArtistArraySchema = z.array(ArtistSchema);

/**
 * Artist Specialization Options
 */
export const ARTIST_SPECIALIZATIONS = {
  COVER_ARTIST: "cover_artist",
  ILLUSTRATOR: "illustrator",
  CHARACTER_DESIGNER: "character_designer",
  MANGA_ARTIST: "manga_artist",
} as const;

export const ARTIST_SPECIALIZATION_LABELS = {
  [ARTIST_SPECIALIZATIONS.COVER_ARTIST]: "Hoạ sĩ vẽ bìa",
  [ARTIST_SPECIALIZATIONS.ILLUSTRATOR]: "Hoạ sĩ minh họa",
  [ARTIST_SPECIALIZATIONS.CHARACTER_DESIGNER]: "Nhà thiết kế nhân vật",
  [ARTIST_SPECIALIZATIONS.MANGA_ARTIST]: "Hoạ sĩ manga",
} as const;
