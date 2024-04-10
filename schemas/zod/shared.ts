import * as z from "zod"

export const EditorContentSchema = z.object({
  type: z.string(),
  content: z.array(z.any()).refine((data) => data.length > 0, {
    message: "Vui lòng nhập nội dung",
  }),
});