/**
 * Mock Data Generators for Dashboard Development
 * Temporary file - will be removed after backend integration
 */

import { DateRange, getDateRangeBounds, generateDateSeries } from "@/lib/utils/date-ranges";
import type {
  DashboardStats,
  TimeSeriesData,
  NovelStatusBreakdown,
  TopNovel,
  PublishingActivityData,
  OwnerType,
} from "./novels";

// ============================================================================
// Helper Functions
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

// ============================================================================
// Mock Data Generators
// ============================================================================

/**
 * Generate mock dashboard statistics
 */
export function getMockDashboardStats(
  ownerType: OwnerType,
  ownerId?: string
): DashboardStats {
  const isTeam = ownerType === "tenant";

  // Team workspaces have higher stats
  const multiplier = isTeam ? 3 : 1;

  return {
    totalNovels: randomInt(5, 20) * multiplier,
    totalChapters: randomInt(50, 300) * multiplier,
    totalViews: randomInt(10000, 100000) * multiplier,
    totalFavorites: randomInt(500, 5000) * multiplier,
    averageRating: randomFloat(3.5, 4.9, 1),
    activeNovels: randomInt(2, 8) * multiplier,
    trend: {
      novels: randomFloat(-10, 25, 1),
      chapters: randomFloat(5, 40, 1),
      views: randomFloat(10, 60, 1),
      favorites: randomFloat(-5, 35, 1),
    },
  };
}

/**
 * Generate mock time series data
 */
export function getMockNovelsTimeSeries(
  ownerType: OwnerType,
  ownerId?: string,
  dateRange: DateRange = "30d"
): TimeSeriesData[] {
  const { start, end } = getDateRangeBounds(dateRange);
  const dates = generateDateSeries(start, end, "day");

  const isTeam = ownerType === "tenant";
  const baseViews = isTeam ? 500 : 200;
  const baseChapters = isTeam ? 3 : 1;
  const baseFavorites = isTeam ? 20 : 8;

  return dates.map((date, index) => {
    // Add some growth trend and randomness
    const growthFactor = 1 + (index / dates.length) * 0.3;
    const randomFactor = 0.7 + Math.random() * 0.6;

    return {
      date: date.toISOString().split("T")[0],
      views: Math.floor(baseViews * growthFactor * randomFactor),
      chapters: Math.floor(baseChapters * randomFactor),
      novels: index % 5 === 0 ? 1 : 0, // New novel every 5 days
      favorites: Math.floor(baseFavorites * growthFactor * randomFactor),
    };
  });
}

/**
 * Generate mock status breakdown
 */
export function getMockNovelsByStatus(
  ownerType: OwnerType,
  ownerId?: string
): NovelStatusBreakdown[] {
  const isTeam = ownerType === "tenant";
  const total = isTeam ? randomInt(15, 30) : randomInt(5, 15);

  // Distribute novels across statuses with realistic proportions
  const ongoing = Math.floor(total * randomFloat(0.3, 0.5));
  const completed = Math.floor(total * randomFloat(0.2, 0.3));
  const draft = Math.floor(total * randomFloat(0.1, 0.2));
  const hiatus = Math.floor(total * randomFloat(0.05, 0.15));
  const dropped = total - ongoing - completed - draft - hiatus;

  const breakdown = [
    { status: "ongoing" as const, count: ongoing },
    { status: "completed" as const, count: completed },
    { status: "draft" as const, count: draft },
    { status: "hiatus" as const, count: hiatus },
    { status: "dropped" as const, count: dropped },
  ];

  return breakdown.map((item) => ({
    ...item,
    percentage: (item.count / total) * 100,
  }));
}

/**
 * Generate mock top novels
 */
export function getMockTopNovels(
  ownerType: OwnerType,
  ownerId?: string,
  sortBy: "views" | "favorites" | "rating" = "views",
  limit: number = 5
): TopNovel[] {
  const isTeam = ownerType === "tenant";
  const multiplier = isTeam ? 2 : 1;

  const statuses: Array<"draft" | "ongoing" | "completed" | "hiatus" | "dropped"> = [
    "ongoing",
    "ongoing",
    "ongoing",
    "completed",
    "draft",
  ];

  const novelTitles = [
    "Chuyển sinh thành ma vương",
    "Tu tiên trong thế giới hiện đại",
    "Hệ thống game trong dị giới",
    "Phàm nhân tu tiên truyện",
    "Võ lâm truyền kỳ",
    "Kiếm đạo độc tôn",
    "Thần võ thiên tôn",
    "Đấu phá thương khung",
  ];

  return Array.from({ length: limit }, (_, index) => {
    const baseViews = (limit - index) * 10000 * multiplier;
    const baseFavorites = (limit - index) * 500 * multiplier;

    return {
      id: `novel-${index + 1}`,
      title: novelTitles[index % novelTitles.length],
      status: statuses[index % statuses.length],
      viewCount: randomInt(baseViews * 0.8, baseViews * 1.2),
      favoriteCount: randomInt(baseFavorites * 0.8, baseFavorites * 1.2),
      ratingAverage: randomFloat(3.8, 4.9, 1),
      ratingCount: randomInt(50, 500) * multiplier,
      totalChapters: randomInt(20, 200),
      totalWords: randomInt(50000, 500000),
      lastChapterAt: new Date(
        Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }).sort((a, b) => {
    if (sortBy === "views") return b.viewCount - a.viewCount;
    if (sortBy === "favorites") return b.favoriteCount - a.favoriteCount;
    return b.ratingAverage - a.ratingAverage;
  });
}

/**
 * Generate mock publishing activity
 */
export function getMockPublishingActivity(
  ownerType: OwnerType,
  ownerId?: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
): PublishingActivityData[] {
  const isTeam = ownerType === "tenant";
  const multiplier = isTeam ? 3 : 1;

  const periodsCount = period === "daily" ? 30 : period === "weekly" ? 12 : 12;
  const baseChapters = isTeam ? 5 : 2;
  const baseWords = 3000;

  return Array.from({ length: periodsCount }, (_, index) => {
    const date = new Date();

    if (period === "daily") {
      date.setDate(date.getDate() - (periodsCount - index - 1));
    } else if (period === "weekly") {
      date.setDate(date.getDate() - (periodsCount - index - 1) * 7);
    } else {
      date.setMonth(date.getMonth() - (periodsCount - index - 1));
    }

    const randomFactor = 0.5 + Math.random();
    const chapters = Math.floor(baseChapters * randomFactor * multiplier);

    return {
      period: date.toISOString().split("T")[0],
      chaptersPublished: chapters,
      wordsPublished: chapters * randomInt(baseWords * 0.8, baseWords * 1.5),
    };
  });
}

// ============================================================================
// Exported Mock API Functions
// ============================================================================

/**
 * Mock API: Get dashboard statistics
 */
export async function getDashboardStats(
  ownerType: OwnerType,
  ownerId?: string
): Promise<DashboardStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockDashboardStats(ownerType, ownerId);
}

/**
 * Mock API: Get time series data
 */
export async function getNovelsTimeSeries(
  ownerType: OwnerType,
  ownerId?: string,
  dateRange: DateRange = "30d"
): Promise<TimeSeriesData[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return getMockNovelsTimeSeries(ownerType, ownerId, dateRange);
}

/**
 * Mock API: Get status breakdown
 */
export async function getNovelsByStatus(
  ownerType: OwnerType,
  ownerId?: string
): Promise<NovelStatusBreakdown[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return getMockNovelsByStatus(ownerType, ownerId);
}

/**
 * Mock API: Get top novels
 */
export async function getTopNovels(
  ownerType: OwnerType,
  ownerId?: string,
  sortBy: "views" | "favorites" | "rating" = "views",
  limit: number = 5
): Promise<TopNovel[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return getMockTopNovels(ownerType, ownerId, sortBy, limit);
}

/**
 * Mock API: Get publishing activity
 */
export async function getPublishingActivity(
  ownerType: OwnerType,
  ownerId?: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
): Promise<PublishingActivityData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockPublishingActivity(ownerType, ownerId, period);
}
