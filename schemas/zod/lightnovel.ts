import * as z from "zod"

import { EditorContentSchema } from "./shared"

export const lightnovelSchema = z.object({
  name: z.string().trim().min(1, { message: "Tên lightnovel là bắt buộc" }),
  author: z.string().trim().min(1, { message: "Tên tác giả là bắt buộc" }),
  artist: z.string().optional(),
  note: EditorContentSchema.optional(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string()
  }), { required_error: "Vui lòng chọn thể loại" }),
  other_names: z.array(
    z.object({
      id: z.string({ required_error: "Vui lòng nhập ít nhất một tên khác" }),
      text: z.string({ required_error: "Vui lòng nhập ít nhất một tên khác" }),
    }), { required_error: "Vui lòng nhập ít nhất một tên khác" }
  ).nonempty({ message: "Vui lòng nhập ít nhất một tên khác" }),
  summary: EditorContentSchema,
  image: z.object({
    key: z.string(),
    url: z.string().url()
  }).optional(),
})

export type LightnovelSchema = z.infer<typeof lightnovelSchema>

export const lightnovelVolumeSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên chapter" }),
  image: z.object({
    key: z.string().optional(),
    url: z.string().url()
  }).optional(),
})

export const lightnovelChapterSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên chapter" }),
  charge: z.boolean(),
  volume_id: z.string().min(1, { message: "Vui lòng chọn volume" }),
  content: EditorContentSchema
})