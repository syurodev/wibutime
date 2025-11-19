/**
 * Content type definition
 */
export type CONTENT_TYPE = "anime" | "manga" | "novel";

export const CONTENT_TYPE = {
  ANIME: "anime" as CONTENT_TYPE,
  MANGA: "manga" as CONTENT_TYPE,
  NOVEL: "novel" as CONTENT_TYPE,
};

/**
 * Alias for API model usage
 */
export type ContentType = CONTENT_TYPE;

/**
 * Content status
 */
export type ContentStatus = "ongoing" | "completed" | "hiatus";

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
