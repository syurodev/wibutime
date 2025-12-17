import { NovelChapterSchema } from "@/features/novel/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import { NovelChapter } from "./types";

/**
 * Get chapter by ID
 * Cached with React cache for deduplication
 */
export const getChapter = cache(async (id: string): Promise<NovelChapter> => {
  const url = endpoint("novels", "chapters", id);

  const response = await serverApi.get<StandardResponse<NovelChapter>>(url, {
    next: {
      revalidate: 60, // Cache 1 minute
      tags: [`chapter-${id}`],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch chapter");
  }

  return ApiParser.parse(NovelChapterSchema, response);
});
