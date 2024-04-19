import * as z from "zod";

export const verificationEmailSchema = z.object({
  email: z.string().trim().email({ message: "Vui lòng nhập email hợp lệ" }),
  code: z.string().refine((value) => value.length === 6, {
    message: "Code phải có 6 số.",
  }),
});
