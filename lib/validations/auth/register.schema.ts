import { z } from "zod";

// Password validation requirements
const passwordRequirements = {
  minLength: 12,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
};

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .optional(),

  display_name: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must not exceed 50 characters")
    .optional(),

  password: z
    .string()
    .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
    .regex(passwordRequirements.hasLowercase, "Password must contain at least 1 lowercase letter")
    .regex(passwordRequirements.hasUppercase, "Password must contain at least 1 uppercase letter")
    .regex(passwordRequirements.hasNumber, "Password must contain at least 1 number")
    .regex(passwordRequirements.hasSpecialChar, "Password must contain at least 1 special character"),
});

// Export the TypeScript type
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Export password requirements for UI
export { passwordRequirements };
