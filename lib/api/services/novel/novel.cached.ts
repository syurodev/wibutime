/**
 * Cached Novel Service - Optimized data fetching for novel content
 * Uses 'use cache' directive for better performance
 */

import { MEDIA_TYPE } from "@/lib/constants/default";
import { cacheLife, cacheTag } from "next/cache";
import { MediaSeries } from "../../models/content/base-content";
import { ContentService } from "../base-content/content.service";

/**
 * Get featured novels with caching
 */
export async function getCachedFeaturedNovels() {
  "use cache";
  cacheTag("featured-novels");
  cacheLife("featured");

  // Get all featured and filter for novels
  const data = await ContentService.getFeaturedList();
  const novels = data.filter((item) => item.type === MEDIA_TYPE.NOVEL);
  return structuredClone(novels);
}

/**
 * Get trending novels with caching
 */
export async function getCachedTrendingNovels(
  limit = 10
): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("trending-novels");
  cacheLife("trending");

  const { items } = await ContentService.getTrendingPaginated({
    type: MEDIA_TYPE.NOVEL,
    limit,
  });
  return items;
}

/**
 * Get latest novel updates with caching
 */
export async function getCachedLatestNovels(
  limit = 10
): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("latest-novels");
  cacheLife("latest");

  const { items } = await ContentService.getLatestPaginated({
    type: MEDIA_TYPE.NOVEL,
    limit,
  });
  return items;
}

/**
 * Get new novels with caching
 */
export async function getCachedNewNovels(limit = 10): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("new-novels");
  cacheLife("newSeries");

  const { items } = await ContentService.getNewPaginated({
    type: MEDIA_TYPE.NOVEL,
    limit,
  });
  return items;
}
