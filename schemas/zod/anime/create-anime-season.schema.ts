import * as z from "zod";
import { AnimeTypeEnum } from "./create-anime.schema";

export const animeSeasonSchema = z.object({
  name: z.string().trim().min(1, { message: "Tên anime là bắt buộc" }),
  studio: z.string().trim().min(1, { message: "Tên studio là bắt buộc" }),
  broadcast_day: z.string({ required_error: "Vui lòng chọn lịch phát sóng" }),
  broadcast_time: z.date({ required_error: "Vui lòng chọn lịch phát sóng" }),
  aired: z.date({ required_error: "Vui lòng chọn ngày phát sóng" }),
  type: AnimeTypeEnum,
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
  number_of_episodes: z.coerce.number().optional(),
  image: z
    .object({
      key: z.string().optional(),
      url: z.string().url(),
    })
    .optional(),
});
