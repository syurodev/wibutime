import * as z from "zod";

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Nhập lại mật khẩu không đúng",
    path: ["confirmPassword"],
  });
