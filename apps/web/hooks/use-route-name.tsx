"use client";

import { usePathname } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho các giá trị có thể trả về
export type RouteName =
  | "HOME"
  | "NOVELS"
  | "NOVEL_DETAIL"
  | "NOVEL_CHAPTER"
  | "MANGA"
  | "MANGA_DETAIL"
  | "MANGA_CHAPTER"
  | "ANIME"
  | "ANIME_DETAIL"
  | "ANIME_EPISODE"
  | "UNKNOWN"
  | "SEARCH";

const useRouteName = (): RouteName => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Loại bỏ phần tử rỗng

  if (segments.length === 0) return "HOME";

  const section = segments[0] as "novels" | "anime" | "manga" | string; // Xác định phần đầu tiên

  if (["novels", "anime", "manga"].includes(section)) {
    if (segments.length === 1) return section.toUpperCase() as RouteName; // "NOVELS", "ANIME", "MANGA"
    if (segments.length === 2)
      return `${section.toUpperCase()}_DETAIL` as RouteName; // "NOVEL_DETAIL", "ANIME_DETAIL", "MANGA_DETAIL"

    // Xử lý chương/tập
    if (
      (section === "novels" || section === "manga") &&
      segments.length === 4 &&
      segments[2] === "r"
    ) {
      return `${section.toUpperCase()}_CHAPTER` as RouteName; // "NOVEL_CHAPTER", "MANGA_CHAPTER"
    }

    if (section === "anime" && segments.length === 4 && segments[2] === "w") {
      return "ANIME_EPISODE";
    }
  }

  return "UNKNOWN";
};

export default useRouteName;
