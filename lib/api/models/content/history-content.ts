import { CONTENT_TYPE } from "@/lib/constants/default";
import z from "zod";
import { BaseUserSchema } from "../user/base-user";
import { MediaUnitSchema, GenreSchema } from "./base-content";

export const NovelBookmarkSchema = z.object({
  node_id: z.string(),
  preview: z.string(),
});

export type NovelBookmark = z.infer<typeof NovelBookmarkSchema>;

export const HistoryMediaSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1),

  // Content fields với defaults
  cover_url: z.string().nullable(),
  description: z.string().nullable().optional(),

  // Type và status với defaults
  type: z
    .enum([CONTENT_TYPE.ANIME, CONTENT_TYPE.MANGA, CONTENT_TYPE.NOVEL])
    .default(CONTENT_TYPE.NOVEL),
  status: z
    .enum(["ongoing", "completed", "hiatus", "cancelled"])
    .default("ongoing"),

  author: BaseUserSchema, // người đăng

  // Relations với defaults
  genres: z.array(GenreSchema).default([]),

  // Stats với defaults
  rating: z.number().min(0).max(10).default(0),
  views: z.number().int().min(0).default(0),
  favorites: z.number().int().min(0).default(0),

  // Progress tracking
  total_units: z.number().int().min(0).optional(), // Total chapters/episodes
  user_progress_percentage: z.number().min(0).max(100).optional(), // Calculated %

  // Optional fields
  latest_unit: MediaUnitSchema.optional(),
  novel_last_read_info: NovelBookmarkSchema.optional(), // Có khả năng có với type CONTENT_TYPE.NOVEL và các type khác sẻ không có
  anime_last_episode_time_viewed: z.string().optional(), // Thời gian xem của episode cuối cùng của tập anime ví dụ 10:00 của tập trong latest_unit
  manga_last_page_read: z.number().int().min(0).optional(), // Trang đã đọc của manga trong latest_unit

  last_viewed_at: z.iso.datetime().default(() => new Date().toISOString()),
  content_updated_at: z.iso.datetime().default(() => new Date().toISOString()),
});

export type HistoryMedia = z.infer<typeof HistoryMediaSchema>;
