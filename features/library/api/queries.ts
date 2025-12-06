"use cache";
import type { MEDIA_TYPE } from "@/lib/constants/default";

import { LibraryService } from "../services/library.service";

export async function getLibraryPaginated(options?: {
  type?: MEDIA_TYPE | "all";
  page?: number;
  limit?: number;
  sort?: "recent" | "title" | "updated" | "rating";
}) {
  return LibraryService.getLibraryPaginated(options);
}
