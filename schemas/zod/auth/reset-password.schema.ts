import * as z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Vui lòng nhập email hợp lệ" }),
  password: z.string().refine((value) => value.length === 6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
});
