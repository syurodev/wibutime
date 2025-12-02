/**
 * Content type definition
 */
export type MEDIA_TYPE = "anime" | "manga" | "novel";

export const MEDIA_TYPE = {
  ANIME: "anime" as MEDIA_TYPE,
  MANGA: "manga" as MEDIA_TYPE,
  NOVEL: "novel" as MEDIA_TYPE,
};

/**
 * Alias for API model usage
 */
export type MediaType = MEDIA_TYPE;

/**
 * Content status
 */

export const MEDIA_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  HIATUS: "hiatus",
};

/**
 * Latest chapter/episode info
 */
export interface LatestChapterRaw {
  number: number;
  title: string;
  published_at: string;
}

export const DEFAULT_LIMIT = 20;
export const DEFAULT_PAGE = 1;
export const DEFAULT_API_VERSION = "v1";
