import { z } from "zod";

// Create Creator Request Schema
export const CreateCreatorRequestSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export type CreateCreatorRequest = z.infer<typeof CreateCreatorRequestSchema>;

// Update Creator Request Schema
export const UpdateCreatorRequestSchema = z.object({
    name: z.string().max(255, "Name must be less than 255 characters").optional(),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export type UpdateCreatorRequest = z.infer<typeof UpdateCreatorRequestSchema>;

// List Creators Request Schema
export const ListCreatorsRequestSchema = z.object({
    page: z.number().min(1, "Page must be at least 1").default(1).optional(),
    page_size: z.number().min(1, "Page size must be at least 1").max(100, "Page size must be at most 100").default(20).optional(),
    search: z.string().max(100, "Search must be less than 100 characters").optional(),
});

export type ListCreatorsRequest = z.infer<typeof ListCreatorsRequestSchema>;

// Validation helper functions
export const validateCreateCreatorRequest = (data: unknown): CreateCreatorRequest => {
    return CreateCreatorRequestSchema.parse(data);
};

export const validateUpdateCreatorRequest = (data: unknown): UpdateCreatorRequest => {
    return UpdateCreatorRequestSchema.parse(data);
};

export const validateListCreatorsRequest = (data: unknown): ListCreatorsRequest => {
    return ListCreatorsRequestSchema.parse(data);
};
