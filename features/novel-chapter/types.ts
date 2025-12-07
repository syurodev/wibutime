import { NovelChapterSchema } from "@/features/novel/types";
import { z } from "zod";

export type NovelChapter = z.infer<typeof NovelChapterSchema>;

/**
 * Create Chapter Request Schema
 */
export const CreateChapterSchema = z.object({
  chapter_number: z.number().int().min(1),
  title: z.string().min(1, "Title is required"),
  content: z.any(), // JSON content from editor
  word_count: z.number().int().min(0).optional(),
  character_count: z.number().int().min(0).optional(),
  author_notes: z.any().optional(),
  is_free: z.boolean().default(true),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  display_order: z.number().int().optional(),
  scheduled_at: z.string().datetime().optional(),
});

export type CreateChapterRequest = z.infer<typeof CreateChapterSchema>;

/**
 * Update Chapter Request Schema
 */
export const UpdateChapterSchema = CreateChapterSchema.partial().extend({
  volume_id: z.string().uuid().optional(),
});

export type UpdateChapterRequest = z.infer<typeof UpdateChapterSchema>;

/**
 * Chapter Statistics Schema
 */
export const ChapterStatisticsSchema = z.object({
  view_count: z.number().int().min(0).optional(),
  like_count: z.number().int().min(0).optional(),
  comment_count: z.number().int().min(0).optional(),
});

export type ChapterStatistics = z.infer<typeof ChapterStatisticsSchema>;

/**
 * List Chapters Response Schema
 */
export const ListChaptersResponseSchema = z.object({
  volume_id: z.string(),
  volume_title: z.string(),
  chapters: z.array(NovelChapterSchema),
});

export type ListChaptersResponse = z.infer<typeof ListChaptersResponseSchema>;
