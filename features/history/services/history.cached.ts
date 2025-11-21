"use server";

import type { HistoryMedia } from "@/features/history/types/history-content";
import { cacheLife, cacheTag } from "next/cache";
import { HistoryService } from "./history.service";

export async function getCachedHistory(limit = 12): Promise<HistoryMedia[]> {
  "use cache";
  cacheTag("history");
  cacheLife("history");

  return await HistoryService.getRecentHistory(limit);
}
