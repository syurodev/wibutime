/**
 * Mock history data generator
 * Reuses base content mocks to create realistic history entries
 */

import {
  HistoryMediaSchema,
  type HistoryMedia,
} from "@/features/history/types/history-content";
import { getMockMediaSeries } from "@/lib/api/mock/mock-base-content";
import { MediaUnitSchema } from "@/lib/api/models/content/base-content";
import { CONTENT_TYPE } from "@/lib/constants/default";

const ONE_HOUR_MS = 1000 * 60 * 60;

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomTimecode = () => {
  const minutes = randomInt(5, 45);
  const seconds = randomInt(0, 59);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

let historyCache: HistoryMedia[] | null = null;

export const getMockHistoryMedia = (count = 12): HistoryMedia[] => {
  if (!historyCache) {
    const series = getMockMediaSeries(40);
    historyCache = series.map((item, index) => {
      // Extract chapter/episode number from latest_chapter title
      const chapterMatch = item.latest_chapter?.title?.match(/(\d+)/);
      const currentUnit = chapterMatch
        ? parseInt(chapterMatch[1], 10)
        : randomInt(10, 80);
      const totalUnits = randomInt(currentUnit + 10, 150);
      const progressPercentage = Math.min(
        Math.round((currentUnit / totalUnits) * 100),
        100
      );

      const latestUnit = MediaUnitSchema.parse({
        id: item.latest_chapter?.id ?? crypto.randomUUID(),
        title: item.latest_chapter?.title ?? `Chapter ${currentUnit}`,
        published_at:
          item.latest_chapter?.published_at ??
          item.updated_at ??
          new Date().toISOString(),
      });

      const viewedAt = new Date(
        Date.now() - randomInt(1, 72) * ONE_HOUR_MS - randomInt(0, 59) * 60000
      ).toISOString();

      // Sometimes content_updated_at is after last_viewed_at (new update)
      const hasUpdate = Math.random() > 0.7; // 30% chance of new update
      const contentUpdatedAt = hasUpdate
        ? new Date(Date.now() - randomInt(0, 48) * ONE_HOUR_MS).toISOString()
        : new Date(
            new Date(viewedAt).getTime() - randomInt(1, 48) * ONE_HOUR_MS
          ).toISOString();

      const baseHistory = {
        id: `${item.id}-history-${index}`,
        title: item.title,
        slug: item.slug,
        cover_url: item.cover_url,
        description: item.description
          ? `${item.title} - A captivating ${item.type} series with amazing storyline and characters.`
          : null,
        type: item.type,
        status: item.status,
        author: item.author,
        // New fields from MediaSeries
        genres: item.genres || [],
        rating: item.rating || randomInt(70, 95) / 10, // 7.0 - 9.5
        views: item.views || randomInt(10000, 1000000),
        favorites: item.favorites || randomInt(500, 50000),
        // Progress tracking
        total_units: totalUnits,
        user_progress_percentage: progressPercentage,
        // Existing fields
        latest_unit: latestUnit,
        last_viewed_at: viewedAt,
        content_updated_at: contentUpdatedAt,
      };

      if (item.type === CONTENT_TYPE.ANIME) {
        return HistoryMediaSchema.parse({
          ...baseHistory,
          anime_last_episode_time_viewed: randomTimecode(),
        });
      }

      if (item.type === CONTENT_TYPE.MANGA) {
        return HistoryMediaSchema.parse({
          ...baseHistory,
          manga_last_page_read: randomInt(5, 25),
        });
      }

      return HistoryMediaSchema.parse({
        ...baseHistory,
        novel_last_read_info: {
          node_id: latestUnit.id,
          preview: `Đang đọc đoạn ${randomInt(1, 5)}`,
        },
      });
    });
  }

  return historyCache.slice(0, Math.min(count, historyCache.length));
};
