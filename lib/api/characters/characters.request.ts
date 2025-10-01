import { z } from "zod";

// Create Character Request Schema
export const CreateCharacterRequestSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type CreateCharacterRequest = z.infer<typeof CreateCharacterRequestSchema>;

// Update Character Request Schema
export const UpdateCharacterRequestSchema = z.object({
    name: z.string().max(255, "Name must be less than 255 characters").optional(),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type UpdateCharacterRequest = z.infer<typeof UpdateCharacterRequestSchema>;

// List Characters Request Schema
export const ListCharactersRequestSchema = z.object({
    page: z.number().min(1, "Page must be at least 1").default(1).optional(),
    page_size: z.number().min(1, "Page size must be at least 1").max(100, "Page size must be at most 100").default(20).optional(),
    search: z.string().max(100, "Search must be less than 100 characters").optional(),
});

export type ListCharactersRequest = z.infer<typeof ListCharactersRequestSchema>;

// Validation helper functions
export const validateCreateCharacterRequest = (data: unknown): CreateCharacterRequest => {
    return CreateCharacterRequestSchema.parse(data);
};

export const validateUpdateCharacterRequest = (data: unknown): UpdateCharacterRequest => {
    return UpdateCharacterRequestSchema.parse(data);
};

export const validateListCharactersRequest = (data: unknown): ListCharactersRequest => {
    return ListCharactersRequestSchema.parse(data);
};