import { z } from 'zod';

export const loginValidationSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  deviceId: z.string(),
  deviceName: z.string(),
  deviceType: z.string(),
  deviceOs: z.string().optional(),
  browserInfo: z.string().optional(),
  ipAddress: z.string().optional(),
});

export type ILoginValidationSchema = z.infer<typeof loginValidationSchema>;
