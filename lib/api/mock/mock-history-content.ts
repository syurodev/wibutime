/**
 * Mock history data generator
 * Reuses base content mocks to create realistic history entries
 */

import { CONTENT_TYPE } from "@/lib/constants/default";
import { MediaUnitSchema } from "../models/content/base-content";
import {
  HistoryMediaSchema,
  type HistoryMedia,
} from "../models/content/history-content";
import { getMockMediaSeries } from "./mock-base-content";

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
      const latestUnit = MediaUnitSchema.parse({
        id: item.latest_chapter?.id ?? crypto.randomUUID(),
        title:
          item.latest_chapter?.title ?? `Chapter ${randomInt(1, 120).toString()}`,
        published_at:
          item.latest_chapter?.published_at ?? item.updated_at ?? new Date().toISOString(),
      });

      const viewedAt = new Date(
        Date.now() - randomInt(1, 72) * ONE_HOUR_MS - randomInt(0, 59) * 60000
      ).toISOString();

      const baseHistory = {
        id: `${item.id}-history-${index}`,
        title: item.title,
        slug: item.slug,
        cover_url: item.cover_url,
        type: item.type,
        status: item.status,
        author: item.author,
        latest_unit: latestUnit,
        last_viewed_at: viewedAt,
        content_updated_at: item.updated_at,
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
