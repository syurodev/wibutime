import * as z from "zod";
import { EditorContentSchema } from "../shared/editor-content.schema";

export const lightnovelChapterCreateSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên chapter" }),
  charge: z.boolean(),
  volume_id: z.string().min(1, { message: "Vui lòng chọn volume" }),
  content: EditorContentSchema,
});

export type LightnovelChapterCreateSchema = z.infer<
  typeof lightnovelChapterCreateSchema
>;
