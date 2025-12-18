import { z } from "zod";

/**
 * SePay Configuration Schema
 */
export const SePayConfigSchema = z.object({
  apiToken: z.string().min(1, "API Token is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  accountName: z.string().min(1, "Account Name is required"),
});

export type SePayConfig = z.infer<typeof SePayConfigSchema>;

// Raw item from API
export interface PaymentConfigItem {
  id: string;
  key: string;
  value: string;
  type: string;
  is_encrypted: boolean;
}
