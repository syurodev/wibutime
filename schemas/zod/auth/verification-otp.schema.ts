import * as z from "zod";

export const verificationOtpSchema = z.object({
  code: z.string().refine((value) => value.length === 6, {
    message: "Code phải có 6 số.",
  }),
});
