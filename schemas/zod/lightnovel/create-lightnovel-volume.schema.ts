import * as z from "zod";

export const lightnovelVolumeCreateSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên chapter" }),
  image: z
    .object({
      key: z.string().optional(),
      url: z.string().url(),
    })
    .optional(),
});

export type LightnovelVolumeCreateSchema = z.infer<
  typeof lightnovelVolumeCreateSchema
>;
