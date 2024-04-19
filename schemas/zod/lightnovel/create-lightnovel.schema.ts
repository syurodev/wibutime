import * as z from "zod";
import { EditorContentSchema } from "../shared/editor-content.schema";

export const lightnovelCreateSchema = z.object({
  name: z.string().trim().min(1, { message: "Tên lightnovel là bắt buộc" }),
  author: z.string().trim().min(1, { message: "Tên tác giả là bắt buộc" }),
  artist: z.string().optional(),
  note: EditorContentSchema.optional(),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
    { required_error: "Vui lòng chọn thể loại" }
  ),
  other_names: z
    .array(
      z.object({
        id: z.string({ required_error: "Vui lòng nhập ít nhất một tên khác" }),
        text: z.string({
          required_error: "Vui lòng nhập ít nhất một tên khác",
        }),
      }),
      { required_error: "Vui lòng nhập ít nhất một tên khác" }
    )
    .nonempty({ message: "Vui lòng nhập ít nhất một tên khác" }),
  summary: EditorContentSchema,
  image: z
    .object({
      key: z.string(),
      url: z.string().url(),
    })
    .optional(),
});

export type LightnovelCreateSchema = z.infer<typeof lightnovelCreateSchema>;
