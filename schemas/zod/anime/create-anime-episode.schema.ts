import * as z from "zod";

export const animeEpisodeCreateSchema = z.object({
  season_id: z.string().min(1, { message: "Vui lòng chọn season" }),
  charge: z.boolean(),
  thumbnail: z
    .object({
      key: z.string().optional(),
      url: z.string().url(),
    })
    .optional(),
  content: z.object({
    key: z.string().optional(),
    url: z.string().url(),
  }),
  index: z.string().min(1, { message: "Vui lòng nhập số thứ tự của tập phim" }),
});
