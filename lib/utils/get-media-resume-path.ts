import type { MEDIA_TYPE } from "@/lib/constants/default";

const MEDIA_TYPE_PATH: Record<MEDIA_TYPE, string> = {
  anime: "anime",
  manga: "manga",
  novel: "novels",
};

type MediaWithSlug = {
  slug: string;
  type: MEDIA_TYPE;
};

export const getMediaResumePath = (media: MediaWithSlug) =>
  `/${MEDIA_TYPE_PATH[media.type]}/${media.slug}`;
