import * as z from "zod";
import { EditorContentSchema } from "../shared/editor-content.schema";

export const AnimeTypeEnum = z.enum(["LongEpisode", "Movie", "Ova"], {
  required_error: "Vui lòng chọn loại anime",
});

export const animeCreateSchema = z.object({
  name: z.string().trim().min(1, { message: "Tên anime là bắt buộc" }),
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
  studio: z.string().trim().min(1, { message: "Tên studio là bắt buộc" }),
  broadcast_day: z.string({ required_error: "Vui lòng chọn lịch phát sóng" }),
  broadcast_time: z.date({ required_error: "Vui lòng chọn lịch phát sóng" }),
  aired: z.date({ required_error: "Vui lòng chọn ngày phát sóng" }),
  note: EditorContentSchema.optional(),
  type: AnimeTypeEnum,
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
    { required_error: "Vui lòng chọn thể loại" }
  ),
  musics: z
    .array(
      z.object({
        type: z.string(),
        name: z.string().min(1, { message: "Vui lòng nhập tên bài hát" }),
        url: z
          .string()
          .url()
          .refine(
            (value) => {
              return (
                value.includes("youtube.com") || value.includes("spotify.com")
              );
            },
            { message: "URL chỉ được chứa domain của YouTube hoặc Spotify" }
          )
          .optional(),
      })
    )
    .optional(),
  summary: EditorContentSchema,
  number_of_episodes: z.coerce.number().optional(),
  image: z
    .object({
      key: z.string().optional(),
      url: z.string().url(),
    })
    .optional(),
});
