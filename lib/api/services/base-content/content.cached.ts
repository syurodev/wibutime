/**
 * Cached Content Service - Optimized data fetching with Cache Components
 * These functions use 'use cache' directive for better performance
 *
 * NOW SIMPLER: Returns plain BaseContentData objects directly
 * No need for toJSON() conversion since ContentService returns plain objects
 *
 * Cache Strategy:
 * - Featured: 5min stale, 15min revalidate, 1hr expire
 * - Trending: 5min stale, 10min revalidate, 1hr expire
 * - Latest: 3min stale, 5min revalidate, 30min expire
 * - New Series: 10min stale, 30min revalidate, 2hr expire
 */

import { cacheLife, cacheTag } from "next/cache";
import { MediaSeries } from "../../models/content/base-content";
import { ContentService } from "./content.service";

/**
 * Get featured list with caching
 * Featured content changes infrequently, so we use longer cache durations
 * Returns plain objects for Cache Components compatibility
 */
export async function getCachedFeaturedList() {
  "use cache";
  cacheTag("featured");
  cacheLife("featured");

  const data = await ContentService.getFeaturedList();
  // Featured still uses class instances - convert to plain objects
  // Use structuredClone instead of JSON.parse(JSON.stringify()) for better performance
  return structuredClone(data.map((item) => item));
}

/**
 * Get trending series with caching
 * Trending data changes based on views, needs moderate freshness
 * Returns plain BaseContentData objects - already serializable
 */
export async function getCachedTrending(limit = 10): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("trending");
  cacheLife("trending");

  // ContentService now returns plain objects directly - no conversion needed!
  const data = await ContentService.getTrending(limit);

  return data;
}

/**
 * Get latest series with caching
 * Latest updates should be relatively fresh for best UX
 * Returns plain BaseContentData objects - already serializable
 */
export async function getCachedLatest(limit = 10): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("latest");
  cacheLife("latest");

  // ContentService now returns plain objects directly - no conversion needed!
  return await ContentService.getLatest(limit);
}

/**
 * Get new series with caching
 * New series don't change as frequently, can use longer cache
 * Returns plain BaseContentData objects - already serializable
 */
export async function getCachedNew(limit = 10): Promise<MediaSeries[]> {
  "use cache";
  cacheTag("new");
  cacheLife("newSeries");

  // ContentService now returns plain objects directly - no conversion needed!
  return await ContentService.getNew(limit);
}
