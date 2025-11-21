import type { CONTENT_TYPE } from "@/lib/constants/default";
import { cacheLife, cacheTag } from "next/cache";
import { LibraryService } from "../services/library.service";

export async function getLibraryPaginated(options?: {
  type?: CONTENT_TYPE | "all";
  page?: number;
  limit?: number;
  sort?: "recent" | "title" | "updated" | "rating";
}) {
  "use cache";
  cacheLife("seconds");
  cacheTag("library-list");

  return LibraryService.getLibraryPaginated(options);
}
