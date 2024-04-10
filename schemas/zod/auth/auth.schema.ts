import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Tên người dùng là bắt buộc" }),
  password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
});
