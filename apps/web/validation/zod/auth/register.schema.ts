import { z } from 'zod';

export const registerValidationSchema = z
  .object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type IRegisterValidationSchema = z.infer<
  typeof registerValidationSchema
>;
