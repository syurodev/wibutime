/**
 * Mock Data Generator for Community Features
 * Uses Zod schemas for type-safe mock data generation
 */

import {
  CreatorStatsSchema,
  type CreatorStats,
} from "../models/community/creator-stats";
import {
  GenreStatsSchema,
  type GenreStats,
} from "../models/community/genre-stats";
import {
  MilestoneSchema,
  type Milestone,
  type MilestoneType,
} from "../models/community/milestone";
import { getMockGenres, getMockMediaSeries } from "./mock-base-content";

/**
 * Mock avatar images
 */
const mockAvatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.jpeg",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
  "/images/avatar-6.png",
  "/images/avatar-7.png",
  "/images/avatar-8.png",
  "/images/avatar-9.jpge",
  "/images/avatar-10.png",
  "/images/avatar-11.png",
  "/images/avatar-12.png",
];

/**
 * Get random item from array
 */
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random date between start and end
 */
function getRandomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

/**
 * Generate mock creator names
 */
const creatorNames = [
  { display: "Akira Tanaka", username: "akira_writes" },
  { display: "Yuki Matsumoto", username: "yuki_storyteller" },
  { display: "Hiro Nakamura", username: "hiro_creator" },
  { display: "Mei Sakura", username: "mei_novels" },
  { display: "Ryu Kobayashi", username: "ryu_author" },
  { display: "Sakura Yamamoto", username: "sakura_tales" },
  { display: "Ken Watanabe", username: "ken_fiction" },
  { display: "Aiko Suzuki", username: "aiko_stories" },
  { display: "Takeshi Ito", username: "takeshi_manga" },
  { display: "Yumi Tanaka", username: "yumi_creative" },
];

/**
 * Module-level cache for generated creators
 */
let mockCreatorsCache: CreatorStats[] | null = null;

/**
 * Generate mock creators with stats
 * @param count - Number of creators to return
 * @returns Array of CreatorStats
 */
export function getMockCreators(count: number = 10): CreatorStats[] {
  // Generate and cache on first call
  if (!mockCreatorsCache) {
    const series = getMockMediaSeries(50); // Get series for popular works

    mockCreatorsCache = creatorNames.map((name, i) => {
      const popularWork = series[i % series.length];

      // Generate bio text as TNode[] (1 paragraph only for card display)
      const bioText = `Passionate creator sharing stories with the world. ${Math.floor(
        Math.random() * 100
      )}+ works published.`;

      const bio = [
        {
          type: "p",
          children: [{ text: bioText }],
        },
      ];

      const creatorData = {
        id: crypto.randomUUID(),
        display_name: name.display,
        username: name.username,
        avatar_url: getRandom(mockAvatarImages),
        follower_count: Math.floor(Math.random() * 50000) + 1000,
        works_count: Math.floor(Math.random() * 30) + 1,
        total_views: Math.floor(Math.random() * 1000000) + 10000,
        is_verified: Math.random() > 0.5,
        bio, // TNode[] instead of string
        popular_work_title: popularWork?.title,
        popular_work_cover_url: popularWork?.cover_url,
        created_at: getRandomDate(new Date(2020, 0, 1), new Date()),
        updated_at: new Date().toISOString(),
      };

      return CreatorStatsSchema.parse(creatorData);
    });
  }

  return mockCreatorsCache.slice(0, Math.min(count, mockCreatorsCache.length));
}

/**
 * Module-level cache for genre stats
 */
let mockGenreStatsCache: GenreStats[] | null = null;

/**
 * Generate mock genres with stats
 * @param count - Number of genres to return
 * @returns Array of GenreStats
 */
export function getMockGenreStats(count: number = 12): GenreStats[] {
  // Generate and cache on first call
  if (!mockGenreStatsCache) {
    const genres = getMockGenres();
    const trends: Array<"rising" | "stable" | "falling"> = [
      "rising",
      "stable",
      "falling",
    ];

    const genreColors = [
      "#ef4444", // red
      "#f59e0b", // amber
      "#10b981", // emerald
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#06b6d4", // cyan
      "#f97316", // orange
      "#84cc16", // lime
      "#6366f1", // indigo
      "#14b8a6", // teal
      "#a855f7", // purple
    ];

    mockGenreStatsCache = genres.map((genre, i) => {
      const genreData = {
        ...genre,
        series_count: Math.floor(Math.random() * 1000) + 50,
        active_readers: Math.floor(Math.random() * 100000) + 1000,
        total_views: Math.floor(Math.random() * 10000000) + 100000,
        trend: getRandom(trends),
        description: `Explore the best ${genre.name.toLowerCase()} series on WibuTime`,
        color: genreColors[i % genreColors.length],
      };

      return GenreStatsSchema.parse(genreData);
    });
  }

  return mockGenreStatsCache.slice(
    0,
    Math.min(count, mockGenreStatsCache.length)
  );
}

/**
 * Module-level cache for milestones
 */
let mockMilestonesCache: Milestone[] | null = null;

/**
 * Generate mock community milestones
 * @param count - Number of milestones to return
 * @returns Array of Milestone
 */
export function getMockMilestones(count: number = 6): Milestone[] {
  // Generate and cache on first call
  if (!mockMilestonesCache) {
    const series = getMockMediaSeries(10);
    const creators = getMockCreators(5);

    const milestoneTemplates: Array<{
      type: MilestoneType;
      title: string;
      description: string;
      value: number;
      icon: string;
    }> = [
      {
        type: "platform",
        title: "10 Million Chapters Read",
        description: "Community reached 10M chapters read this month!",
        value: 10000000,
        icon: "book-open",
      },
      {
        type: "platform",
        title: "100K Active Users",
        description: "WibuTime community surpassed 100,000 active readers",
        value: 100000,
        icon: "users",
      },
      {
        type: "series",
        title: `${series[0]?.title || "Series"} Hit 1M Views`,
        description: "Most popular series reached a major milestone",
        value: 1000000,
        icon: "eye",
      },
      {
        type: "creator",
        title: `${creators[0]?.display_name || "Creator"} - 50K Followers`,
        description: "Top creator achieved 50,000 followers",
        value: 50000,
        icon: "star",
      },
      {
        type: "community",
        title: "1000 New Series This Week",
        description: "Record-breaking week for new content",
        value: 1000,
        icon: "trending-up",
      },
      {
        type: "platform",
        title: "5M Hours of Content Read",
        description: "Community spent 5 million hours reading this month",
        value: 5000000,
        icon: "clock",
      },
    ];

    mockMilestonesCache = milestoneTemplates.map((template) => {
      const milestoneData = {
        id: crypto.randomUUID(),
        ...template,
        achieved_at: getRandomDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        ),
        // Add context based on type
        ...(template.type === "series" && {
          series_id: series[0]?.id,
          series_title: series[0]?.title,
        }),
        ...(template.type === "creator" && {
          creator_id: creators[0]?.id,
          creator_name: creators[0]?.display_name,
        }),
      };

      return MilestoneSchema.parse(milestoneData);
    });
  }

  return mockMilestonesCache.slice(
    0,
    Math.min(count, mockMilestonesCache.length)
  );
}

/**
 * Reset all caches (useful for testing)
 */
export function resetCommunityMockCache() {
  mockCreatorsCache = null;
  mockGenreStatsCache = null;
  mockMilestonesCache = null;
}
