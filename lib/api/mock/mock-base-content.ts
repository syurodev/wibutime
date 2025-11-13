/**
 * Mock Data Generator for Base Content
 * Uses Zod schemas for type-safe mock data generation
 */

import { CONTENT_TYPE, type ContentStatus } from "@/lib/constants/default";
import {
  GenreSchema,
  MediaSeriesSchema,
  MediaUnitSchema,
  type Genre,
  type MediaSeries,
} from "../models/content/base-content";
import { BaseUserSchema, type BaseUser } from "../models/user/base-user";
import { generateMockParagraphs } from "./mock-editor";

/**
 * Mock Genres - parsed through Zod schema
 */
const mockGenres: Genre[] = [
  { id: "1", name: "Action" },
  { id: "2", name: "Adventure" },
  { id: "3", name: "Comedy" },
  { id: "4", name: "Drama" },
  { id: "5", name: "Fantasy" },
  { id: "6", name: "Magic" },
  { id: "7", name: "Supernatural" },
  { id: "8", name: "Horror" },
  { id: "9", name: "Mystery" },
  { id: "10", name: "Psychological" },
  { id: "11", name: "Romance" },
  { id: "12", name: "Sci-Fi" },
].map((g) => GenreSchema.parse(g));

const contentTypes = [
  CONTENT_TYPE.ANIME,
  CONTENT_TYPE.MANGA,
  CONTENT_TYPE.NOVEL,
];

const statuses: ContentStatus[] = ["ongoing", "completed", "hiatus"];

const mockCoverImages = [
  "/images/image-1.jpg",
  "/images/image-2.jpg",
  "/images/image-3.png",
  "/images/image-4.jpg",
  "/images/image-5.jpg",
  "/images/image-6.jpg",
  "/images/image-7.jpg",
  "/images/image-8.jpg",
  "/images/image-9.jpg",
  "/images/image-10.png",
  "/images/image-11.jpg",
  "/images/image-12.jpg",
  "/images/image-13.png",
  "/images/image-14.jpeg",
  "/images/image-15.jpg",
  "/images/image-16.jpeg",
  "/images/image-17.jpeg",
  "/images/image-18.jpg",
];

const mockAvatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.jpeg",
  "/images/avatar-4.png",
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
 * Get multiple random unique items from array
 */
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Generate mock user
 */
function generateMockUser(index: number): BaseUser {
  return BaseUserSchema.parse({
    id: crypto.randomUUID(),
    display_name: `Author ${index + 1}`,
    username: `author${index + 1}`,
    avatar_url: getRandom(mockAvatarImages),
    created_at: getRandomDate(new Date(2020, 0, 1), new Date()),
    updated_at: new Date().toISOString(),
  });
}

/**
 * Generate mock media series array
 * All data is validated through Zod schemas
 *
 * @param count - Number of series to generate
 * @returns Array of type-safe MediaSeries
 *
 * @example
 * const series = getMockMediaSeries(10);
 * console.log(series[0].title); // Type-safe!
 */
export function getMockMediaSeries(count: number = 50): MediaSeries[] {
  return Array.from({ length: count }, (_, i) => {
    const title = `Mock Series Title ${i + 1}`;
    const createdAt = getRandomDate(new Date(2022, 0, 1), new Date());
    const updatedAt = getRandomDate(new Date(createdAt), new Date());

    // Create plain object - Zod will validate and add defaults
    const seriesData = {
      id: crypto.randomUUID(),
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description: generateMockParagraphs(),
      cover_url: getRandom(mockCoverImages),
      type: getRandom(contentTypes),
      status: getRandom(statuses),
      genres: getRandomItems(mockGenres, Math.floor(Math.random() * 3) + 1),
      rating: Math.random() * (10 - 6) + 6, // 6.0 - 10.0
      views: Math.floor(Math.random() * 100000),
      favorites: Math.floor(Math.random() * 5000),
      latest_chapter: MediaUnitSchema.parse({
        id: crypto.randomUUID(),
        title: `Chapter ${Math.floor(Math.random() * 100) + 1}`,
        published_at: updatedAt,
      }),
      user: generateMockUser(i),
      created_at: createdAt,
      updated_at: updatedAt,
    };

    // Validate through Zod schema
    return MediaSeriesSchema.parse(seriesData);
  });
}

/**
 * Generate single mock series
 */
export function getMockSeries(overrides?: Partial<MediaSeries>): MediaSeries {
  const series = getMockMediaSeries(1)[0];
  if (!overrides) return series;

  // Merge and re-validate
  return MediaSeriesSchema.parse({
    ...series,
    ...overrides,
  });
}

/**
 * Get mock genres
 */
export function getMockGenres(): Genre[] {
  return mockGenres;
}

/**
 * Get mock user
 */
export function getMockUser(overrides?: Partial<BaseUser>): BaseUser {
  return BaseUserSchema.parse({
    id: crypto.randomUUID(),
    display_name: "Mock User",
    username: "mockuser",
    avatar_url: getRandom(mockAvatarImages),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  });
}

/**
 * Generate incomplete/partial data for testing validation
 * Useful for testing default values and error handling
 */
export function generateIncompleteData() {
  return {
    // Minimal data - should work with defaults
    minimal: {
      id: crypto.randomUUID(),
      title: "Minimal Series",
      slug: "minimal-series",
      user: {
        id: crypto.randomUUID(),
      },
    },

    // Missing required fields - should fail
    invalid: {
      title: "Invalid Series",
      // Missing id and slug
    },

    // Partial data - should work with defaults
    partial: {
      id: crypto.randomUUID(),
      title: "Partial Series",
      slug: "partial-series",
      type: CONTENT_TYPE.ANIME,
      user: {
        id: crypto.randomUUID(),
        username: "testuser",
      },
      // Other fields will use defaults
    },
  };
}
