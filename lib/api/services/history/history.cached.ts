"use server";

import { cacheLife, cacheTag } from "next/cache";
import type { HistoryMedia } from "../../models/content/history-content";
import { HistoryService } from "./history.service";

export async function getCachedHistory(limit = 12): Promise<HistoryMedia[]> {
  "use cache";
  cacheTag("history");
  cacheLife("history");

  return await HistoryService.getRecentHistory(limit);
}
