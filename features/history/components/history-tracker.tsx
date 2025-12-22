"use client";

/**
 * HistoryTracker - Client component that tracks reading progress
 *
 * This component is mounted on chapter pages to automatically
 * record reading progress when user visits a chapter.
 *
 * It fires once on mount (page visit) to update history.
 */

import { updateHistory } from "@/features/history/actions";
import type { NovelPosition } from "@/features/history/types";
import { useEffect, useRef } from "react";

interface HistoryTrackerProps {
  /** Novel/Manga/Anime ID */
  contentId: string;
  /** Media type */
  mediaType: "novel" | "manga" | "anime";
  /** Current chapter/episode ID */
  unitId: string;
  /** Optional: Novel reading position */
  novelPosition?: NovelPosition;
  /** Optional: Manga page number */
  mangaPage?: number;
  /** Optional: Anime time */
  animeTime?: string;
}

/**
 * HistoryTracker component
 *
 * Place this component on chapter/episode pages to automatically track progress.
 *
 * @example
 * // On novel chapter page
 * <HistoryTracker
 *   contentId={novel.id}
 *   mediaType="novel"
 *   unitId={chapter.id}
 * />
 *
 * // With position tracking
 * <HistoryTracker
 *   contentId={novel.id}
 *   mediaType="novel"
 *   unitId={chapter.id}
 *   novelPosition={{ node_id: "para-123", preview: "First paragraph..." }}
 * />
 */
export function HistoryTracker({
  contentId,
  mediaType,
  unitId,
  novelPosition,
  mangaPage,
  animeTime,
}: HistoryTrackerProps) {
  // Use ref to track if we've already called updateHistory
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Fire and forget - we don't need to wait for response
    updateHistory({
      content_id: contentId,
      media_type: mediaType,
      latest_unit_id: unitId,
      novel_last_read_info: novelPosition,
      manga_last_page_read: mangaPage,
      anime_last_episode_time_viewed: animeTime,
    }).catch((error) => {
      // Silent fail - don't interrupt user experience
      console.error("[HistoryTracker] Failed to update history:", error);
    });
  }, [contentId, mediaType, unitId, novelPosition, mangaPage, animeTime]);

  // This component renders nothing
  return null;
}
