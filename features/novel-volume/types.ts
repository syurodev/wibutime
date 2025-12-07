import { NovelVolumeSchema } from "@/features/novel/types";
import { z } from "zod";

export type NovelVolume = z.infer<typeof NovelVolumeSchema>;

/**
 * List volumes response wrapper
 */
export interface ListVolumesResponse {
  novel_id: string;
  novel_title: string;
  volumes: NovelVolume[];
}

/**
 * Create Volume Request Schema
 */
export const CreateVolumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  display_order: z.number().int().optional(),
  is_published: z.boolean().default(false),
});

export type CreateVolumeRequest = z.infer<typeof CreateVolumeSchema>;

/**
 * Update Volume Request Schema
 */
export const UpdateVolumeSchema = CreateVolumeSchema.partial().extend({
  volume_number: z.number().int().optional(),
});

export type UpdateVolumeRequest = z.infer<typeof UpdateVolumeSchema>;
