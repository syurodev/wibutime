/**
 * Content Service - API service for anime/manga/novel content
 * Currently using mock data with simulated API delays
 * Returns plain objects (BaseContentData) - no class instances
 */

import type { BaseContentData } from "../../models";

import type { CONTENT_TYPE } from "@/lib/constants/default";
import { Featured, type FeaturedRaw } from "../../models/content/featured";
import {
  isSuccessResponse,
  type PaginationMeta,
  type StandardResponse,
} from "../../types";

/**
 * Simulate API delay
 * Development: 1000-2000ms (to see skeleton clearly)
 * Production: Remove this when using real API
 */
async function mockDelay(min = 1000, max = 2000): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Base mock series data using available images from public/images/
 * Now uses BaseContentData directly - no conversion needed
 */
const BASE_MOCK_SERIES: BaseContentData[] = [
  {
    id: "1",
    title: "Kimetsu no Yaiba",
    slug: "kimetsu-no-yaiba",
    description:
      "A young boy whose family was killed by demons joins an organization of demon slayers to avenge his family and cure his sister.",
    cover_url: "/images/image-1.jpg",
    type: "anime",
    status: "completed",
    genres: ["Action", "Supernatural", "Shounen"],
    rating: 4.8,
    views: 1245000,
    favorites: 89000,
    latest_chapter: {
      number: 205,
      title: "Life Shining Across the Years",
      published_at: "2024-01-15T10:30:00Z",
    },
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Solo Leveling",
    slug: "solo-leveling",
    description:
      "The weakest hunter becomes humanity's strongest after a mysterious system grants him the power to level up.",
    cover_url: "/images/image-2.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Fantasy", "Isekai"],
    rating: 4.9,
    views: 2340000,
    favorites: 156000,
    latest_chapter: {
      number: 189,
      title: "The Final Battle Begins",
      published_at: "2025-11-08T14:00:00Z",
    },
    created_at: "2023-03-15T00:00:00Z",
    updated_at: "2025-11-08T14:00:00Z",
  },
  {
    id: "3",
    title: "Mushoku Tensei",
    slug: "mushoku-tensei",
    description:
      "A 34-year-old NEET reincarnates in a magical world and decides to live his second life to the fullest without regrets.",
    cover_url: "/images/image-3.png",
    type: "novel",
    status: "ongoing",
    genres: ["Isekai", "Fantasy", "Romance"],
    rating: 4.7,
    views: 980000,
    favorites: 67000,
    latest_chapter: {
      number: 278,
      title: "Reunion",
      published_at: "2025-11-07T09:00:00Z",
    },
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2025-11-07T09:00:00Z",
  },
  {
    id: "4",
    title: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    description:
      "A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse residing within him.",
    cover_url: "/images/image-4.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Supernatural", "Shounen"],
    rating: 4.6,
    views: 1567000,
    favorites: 112000,
    latest_chapter: {
      number: 245,
      title: "The Shibuya Incident - Conclusion",
      published_at: "2025-11-06T12:00:00Z",
    },
    created_at: "2023-04-20T00:00:00Z",
    updated_at: "2025-11-06T12:00:00Z",
  },
  {
    id: "5",
    title: "Re:Zero",
    slug: "rezero-starting-life-in-another-world",
    description:
      "When a normal Japanese man is suddenly transported to a fantasy world, he discovers he has the power to return from death.",
    cover_url: "/images/image-5.jpg",
    type: "anime",
    status: "ongoing",
    genres: ["Isekai", "Drama", "Fantasy"],
    rating: 4.5,
    views: 1123000,
    favorites: 78000,
    latest_chapter: {
      number: 50,
      title: "A Parent and Child",
      published_at: "2025-11-09T08:30:00Z",
    },
    created_at: "2025-11-03T00:00:00Z",
    updated_at: "2025-11-09T08:30:00Z",
  },
  {
    id: "6",
    title: "My Hero Academia",
    slug: "my-hero-academia",
    description:
      "In a world where most humans have superpowers, a powerless boy is determined to become the world's greatest hero.",
    cover_url: "/images/image-6.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Shounen", "Superhero"],
    rating: 4.4,
    views: 1890000,
    favorites: 134000,
    latest_chapter: {
      number: 410,
      title: "The Final Act - Part 3",
      published_at: "2025-11-08T11:00:00Z",
    },
    created_at: "2023-05-12T00:00:00Z",
    updated_at: "2025-11-08T11:00:00Z",
  },
  {
    id: "7",
    title: "The Beginning After The End",
    slug: "the-beginning-after-the-end",
    description:
      "A king from a war-torn world is reborn with all his memories into a new world filled with magic and monsters.",
    cover_url: "/images/image-7.jpg",
    type: "novel",
    status: "ongoing",
    genres: ["Isekai", "Fantasy", "Action"],
    rating: 4.8,
    views: 756000,
    favorites: 52000,
    latest_chapter: {
      number: 456,
      title: "Convergence",
      published_at: "2025-11-08T16:00:00Z",
    },
    created_at: "2023-07-01T00:00:00Z",
    updated_at: "2025-11-08T16:00:00Z",
  },
  {
    id: "8",
    title: "Spy x Family",
    slug: "spy-x-family",
    description:
      "A spy, an assassin, and a telepath come together to form a fake family, each hiding their true identities.",
    cover_url: "/images/image-8.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Comedy", "Action", "Slice of Life"],
    rating: 4.7,
    views: 1456000,
    favorites: 98000,
    latest_chapter: {
      number: 92,
      title: "Mission 92",
      published_at: "2025-11-09T10:00:00Z",
    },
    created_at: "2023-08-15T00:00:00Z",
    updated_at: "2025-11-09T10:00:00Z",
  },
  {
    id: "9",
    title: "Chainsaw Man",
    slug: "chainsaw-man",
    description:
      "Denji is a young boy who works as a Devil Hunter with his pet devil Pochita to pay off his crushing debts.",
    cover_url: "/images/image-9.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Horror", "Supernatural"],
    rating: 4.8,
    views: 2100000,
    favorites: 145000,
    latest_chapter: {
      number: 148,
      title: "A Brief Respite",
      published_at: "2025-11-09T15:00:00Z",
    },
    created_at: "2023-09-01T00:00:00Z",
    updated_at: "2025-11-09T15:00:00Z",
  },
  {
    id: "10",
    title: "Tower of God",
    slug: "tower-of-god",
    description:
      "Reach the top of the Tower and everything will be yours. Bam, a boy seeking his friend, enters the mysterious Tower.",
    cover_url: "/images/image-10.png",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 4.6,
    views: 1678000,
    favorites: 105000,
    latest_chapter: {
      number: 612,
      title: "The Nest - Epilogue",
      published_at: "2025-11-08T18:00:00Z",
    },
    created_at: "2023-02-28T00:00:00Z",
    updated_at: "2025-11-08T18:00:00Z",
  },
  {
    id: "11",
    title: "One Piece",
    slug: "one-piece",
    description:
      "Follow Monkey D. Luffy and his crew on their epic quest to find the legendary treasure One Piece and become King of the Pirates.",
    cover_url: "/images/image-11.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Action", "Adventure", "Shounen"],
    rating: 4.9,
    views: 3500000,
    favorites: 250000,
    latest_chapter: {
      number: 1100,
      title: "The Final Saga Begins",
      published_at: "2025-11-10T10:00:00Z",
    },
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2025-11-10T10:00:00Z",
  },
  {
    id: "12",
    title: "Frieren: Beyond Journey's End",
    slug: "frieren-beyond-journeys-end",
    description:
      "After the party of heroes defeats the Demon King, elf mage Frieren begins a new journey to understand the meaning of life and death.",
    cover_url: "/images/image-12.jpg",
    type: "manga",
    status: "ongoing",
    genres: ["Fantasy", "Adventure", "Drama"],
    rating: 4.9,
    views: 1980000,
    favorites: 175000,
    latest_chapter: {
      number: 125,
      title: "Memories of the Journey",
      published_at: "2025-11-09T12:00:00Z",
    },
    created_at: "2023-10-15T00:00:00Z",
    updated_at: "2025-11-09T12:00:00Z",
  },
  {
    id: "13",
    title: "Overlord",
    slug: "overlord",
    description:
      "When a virtual reality game shuts down, one player finds himself trapped in the game world as his powerful skeletal avatar.",
    cover_url: "/images/image-13.png",
    type: "novel",
    status: "ongoing",
    genres: ["Isekai", "Fantasy", "Dark Fantasy"],
    rating: 4.7,
    views: 1250000,
    favorites: 92000,
    latest_chapter: {
      number: 340,
      title: "The Sorcerer Kingdom Expands",
      published_at: "2025-11-08T20:00:00Z",
    },
    created_at: "2023-06-20T00:00:00Z",
    updated_at: "2025-11-08T20:00:00Z",
  },
];

/**
 * Generate expanded mock data for pagination testing
 * Creates 100+ items by duplicating base data with variations
 * Returns plain BaseContentData objects
 */
function generateMockSeries(): BaseContentData[] {
  const expanded: BaseContentData[] = [];
  const types: ("anime" | "manga" | "novel")[] = ["anime", "manga", "novel"];
  const multiplier = 8; // Generate 13 * 8 = 104 items

  for (let i = 0; i < multiplier; i++) {
    BASE_MOCK_SERIES.forEach((series, index) => {
      const newId = String(i * BASE_MOCK_SERIES.length + index + 1);
      const imageNum = ((index % 13) + 1).toString();

      expanded.push({
        ...series,
        id: newId,
        title: `${series.title} ${i > 0 ? `(Vol ${i})` : ""}`,
        slug: `${series.slug}-${newId}`,
        cover_url: `/images/image-${imageNum}.${
          imageNum === "3" || imageNum === "10" || imageNum === "13"
            ? "png"
            : "jpg"
        }`,
        // Vary the type across iterations
        type: types[i % types.length],
        // Randomize stats slightly
        views: series.views + Math.floor(Math.random() * 100000),
        favorites: series.favorites + Math.floor(Math.random() * 10000),
        rating: Math.min(5, series.rating + (Math.random() * 0.4 - 0.2)),
        // Vary dates
        created_at: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    });
  }

  return expanded;
}

/**
 * Full mock series data (100+ items for pagination testing)
 */
const MOCK_SERIES = generateMockSeries();

/**
 * Mock featured content for hero section
 */
const MOCK_FEATURED: FeaturedRaw[] = [
  {
    id: "featured-1",
    series_id: "2",
    series: BASE_MOCK_SERIES[1], // Solo Leveling
    banner_url: "/images/image-2.jpg",
    title: "Solo Leveling - Season 2",
    description:
      "The Shadow Monarch rises! Follow Sung Jin-Woo as he conquers dungeons and faces his greatest challenges yet. Experience the phenomenon that took the world by storm.",
    badge_text: "Exclusive",
    badge_variant: "exclusive",
    cta_primary: "Đọc ngay",
    cta_secondary: "Thêm vào thư viện",
    order: 1,
  },
  {
    id: "featured-2",
    series_id: "5",
    series: BASE_MOCK_SERIES[4], // Re:Zero
    banner_url: "/images/image-5.jpg",
    title: "Re:Zero - Arc 7 Begins",
    description:
      "Subaru faces his darkest timeline yet. New allies, new enemies, and the power of Return by Death put to the ultimate test.",
    badge_text: "New",
    badge_variant: "new",
    cta_primary: "Watch Now",
    cta_secondary: "Add to Library",
    order: 2,
  },
  {
    id: "featured-3",
    series_id: "11",
    series: BASE_MOCK_SERIES[10], // One Piece
    banner_url: "/images/image-11.jpg",
    title: "One Piece - The Final Saga",
    description:
      "The greatest pirate adventure reaches its climax! Join Luffy and the Straw Hat crew as they sail toward the ultimate treasure and the truth of the world.",
    badge_text: "Hot",
    badge_variant: "hot",
    cta_primary: "Read Now",
    cta_secondary: "Save to Library",
    order: 3,
  },
  {
    id: "featured-4",
    series_id: "12",
    series: BASE_MOCK_SERIES[11], // Frieren
    banner_url: "/images/image-12.jpg",
    title: "Frieren: Beyond Journey's End",
    description:
      "A journey of redemption and reflection. After defeating the Demon King, elf mage Frieren begins a new adventure to understand the meaning of life and legacy.",
    badge_text: "Trending",
    badge_variant: "trending",
    cta_primary: "Start Reading",
    cta_secondary: "Add to Favorites",
    order: 4,
  },
  {
    id: "featured-5",
    series_id: "9",
    series: BASE_MOCK_SERIES[8], // Chainsaw Man
    banner_url: "/images/image-9.jpg",
    title: "Chainsaw Man - Devil Hunter Arc",
    description:
      "Blood, chaos, and chainsaws! Follow Denji's wild journey from poverty to becoming the most unpredictable Devil Hunter. Violence has never been this entertaining.",
    badge_text: "Exclusive",
    badge_variant: "exclusive",
    cta_primary: "Watch Series",
    cta_secondary: "Save Series",
    order: 5,
  },
];

/**
 * Content Service Class
 */
export class ContentService {
  /**
   * Get featured content for hero section
   *
   * @example
   * ```ts
   * const featured = await ContentService.getFeatured();
   * console.log(featured.title);
   * console.log(featured.series.formattedViews);
   * ```
   */
  static async getFeatured(): Promise<Featured> {
    // Simulate API call delay
    await mockDelay();

    // Simulate API response
    const response: StandardResponse<FeaturedRaw> = {
      success: true,
      message: "Featured content retrieved successfully",
      data: MOCK_FEATURED[0],
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch featured content");
    }

    return Featured.fromApi(response.data);
  }

  /**
   * Get all featured content for carousel
   *
   * @example
   * ```ts
   * const featuredList = await ContentService.getFeaturedList();
   * console.log(featuredList.length); // 2
   * ```
   */
  static async getFeaturedList(): Promise<Featured[]> {
    // Simulate API call delay
    await mockDelay();

    // Simulate API response with all featured items
    const response: StandardResponse<FeaturedRaw[]> = {
      success: true,
      message: "Featured list retrieved successfully",
      data: MOCK_FEATURED,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch featured list");
    }

    return Featured.fromApiArray(response.data);
  }

  /**
   * Get trending series
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const trending = await ContentService.getTrending(5);
   * ```
   */
  static async getTrending(limit = 10): Promise<BaseContentData[]> {
    await mockDelay();

    // Filter and sort by views (trending = high views)
    const trending = [...MOCK_SERIES]
      .filter((s) => s.views >= 10000)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    // Debug: Log returned data
    console.log("🎯 [ContentService.getTrending] Returning plain objects:", {
      totalItems: trending.length,
      firstItem: {
        title: trending[0]?.title,
        cover_url: trending[0]?.cover_url,
        type: trending[0]?.type,
        has_cover: !!trending[0]?.cover_url,
      },
    });

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "Trending series retrieved successfully",
      data: trending,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending series");
    }

    // Return plain objects directly - no class conversion needed
    return response.data;
  }

  /**
   * Get latest updated series
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const latest = await ContentService.getLatest(8);
   * ```
   */
  static async getLatest(limit = 10): Promise<BaseContentData[]> {
    await mockDelay();

    // Sort by updated_at (most recent first)
    const latest = [...MOCK_SERIES]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "Latest series retrieved successfully",
      data: latest,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest series");
    }

    return response.data;
  }

  /**
   * Get popular series (by favorites)
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const popular = await ContentService.getPopular(10);
   * ```
   */
  static async getPopular(limit = 10): Promise<BaseContentData[]> {
    await mockDelay();

    // Sort by favorites
    const popular = [...MOCK_SERIES]
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, limit);

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "Popular series retrieved successfully",
      data: popular,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch popular series");
    }

    return response.data;
  }

  /**
   * Get new series (created recently)
   * Returns plain BaseContentData objects
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const newSeries = await ContentService.getNew(6);
   * ```
   */
  static async getNew(limit = 10): Promise<BaseContentData[]> {
    await mockDelay();

    // Sort by created_at (newest first)
    const newSeries = [...MOCK_SERIES]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "New series retrieved successfully",
      data: newSeries,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new series");
    }

    return response.data;
  }

  /**
   * Get all unique genres from series
   *
   * @example
   * ```ts
   * const genres = await ContentService.getGenres();
   * ```
   */
  static async getGenres(): Promise<string[]> {
    await mockDelay(200, 500); // Faster for genres

    const allGenres = MOCK_SERIES.flatMap((s) => s.genres);
    const uniqueGenres = Array.from(new Set(allGenres)).sort();

    const response: StandardResponse<string[]> = {
      success: true,
      message: "Genres retrieved successfully",
      data: uniqueGenres,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genres");
    }

    return response.data;
  }

  /**
   * Get trending series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getTrendingPaginated({ type: 'anime', page: 2, limit: 20 });
   * console.log(result.items); // Series[]
   * console.log(result.totalPages); // 5
   * ```
   */
  static async getTrendingPaginated(options?: {
    type?: CONTENT_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: BaseContentData[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = [...MOCK_SERIES].filter((s) => s.views >= 10000);
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort by views (trending = high views)
    const sortedSeries = filteredSeries.sort((a, b) => b.views - a.views);

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "Trending series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending series");
    }

    return {
      items: response.data,
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }

  /**
   * Get latest updated series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getLatestPaginated({ type: 'manga', page: 1 });
   * ```
   */
  static async getLatestPaginated(options?: {
    type?: CONTENT_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: BaseContentData[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = [...MOCK_SERIES];
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort by updated_at (most recent first)
    const sortedSeries = filteredSeries.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "Latest series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest series");
    }

    return {
      items: response.data,
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }

  /**
   * Get new series with pagination
   *
   * @param options - Pagination and filter options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @example
   * ```ts
   * const result = await ContentService.getNewPaginated({ type: 'novel', page: 1 });
   * ```
   */
  static async getNewPaginated(options?: {
    type?: CONTENT_TYPE | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    items: BaseContentData[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { type = "all", page = 1, limit = 20 } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = [...MOCK_SERIES];
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort by created_at (newest first)
    const sortedSeries = filteredSeries.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<BaseContentData[]> = {
      success: true,
      message: "New series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new series");
    }

    return {
      items: response.data,
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }
}
