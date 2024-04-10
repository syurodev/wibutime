import * as z from "zod";

export const resetSchema = z.object({
  email: z.string().trim().email({ message: "Vui lòng nhập email hợp lệ" }),
});
