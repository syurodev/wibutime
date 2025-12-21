import { z } from "zod";
import { OrganizationStatus } from "./enums";

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  status: z.enum(OrganizationStatus),
  avatar_url: z.string().nullable().optional(),
  is_recruiting: z.boolean(),
  member_count: z.number(),
  completed_translations: z.number(),
  created_at: z.string(),
  description: z
    .object({
      text: z.string(),
    })
    .nullable()
    .optional(),

  // Rank Comparison (Optional)
  current_rank: z.number().int().optional(),
  previous_rank: z.number().int().optional().nullable(),
  rank_change: z.number().int().optional().nullable(),
});

// ... existing code ...
export type Organization = z.infer<typeof OrganizationSchema>;

export const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  description: z.any().optional(),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export const MyOrganizationsSchema = z.object({
  // ... existing code ...
  owned: OrganizationSchema.nullable().optional(),
  member: z.array(OrganizationSchema),
});

export type MyOrganizationsResponse = z.infer<typeof MyOrganizationsSchema>;
