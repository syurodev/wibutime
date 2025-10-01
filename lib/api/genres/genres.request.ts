import { z } from "zod";

// Create Genre Request Schema
export const CreateGenreRequestSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
});

export type CreateGenreRequest = z.infer<typeof CreateGenreRequestSchema>;

// Update Genre Request Schema
export const UpdateGenreRequestSchema = z.object({
    name: z
        .string()
        .max(100, "Name must be less than 100 characters")
        .optional(),
});

export type UpdateGenreRequest = z.infer<typeof UpdateGenreRequestSchema>;

// List Genres Request Schema
export const ListGenresRequestSchema = z.object({
    page: z.number().min(1, "Page must be at least 1").default(1).optional(),
    page_size: z
        .number()
        .min(1, "Page size must be at least 1")
        .max(100, "Page size must be at most 100")
        .default(20)
        .optional(),
    search: z
        .string()
        .max(100, "Search must be less than 100 characters")
        .optional(),
});

export type ListGenresRequest = z.infer<typeof ListGenresRequestSchema>;

// Validation helper functions
export const validateCreateGenreRequest = (
    data: unknown,
): CreateGenreRequest => {
    return CreateGenreRequestSchema.parse(data);
};

export const validateUpdateGenreRequest = (
    data: unknown,
): UpdateGenreRequest => {
    return UpdateGenreRequestSchema.parse(data);
};

export const validateListGenresRequest = (data: unknown): ListGenresRequest => {
    return ListGenresRequestSchema.parse(data);
};
