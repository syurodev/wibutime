/**
 * Content Service - API service for anime/manga/novel content
 * Currently using mock data with simulated API delays
 */

import { Featured, type FeaturedRaw } from "../models/featured";
import { Series, type SeriesRaw } from "../models/series";
import { isSuccessResponse, type StandardResponse } from "../types";

/**
 * Simulate API delay (500-1500ms)
 */
async function mockDelay(min = 500, max = 1500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Mock series data using available images from public/images/
 */
const MOCK_SERIES: SeriesRaw[] = [
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
    cover_url: "/images/image-1.jpg",
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
    cover_url: "/images/image-2.jpg",
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
];

/**
 * Mock featured content for hero section
 */
const MOCK_FEATURED: FeaturedRaw[] = [
  {
    id: "featured-1",
    series_id: "2",
    series: MOCK_SERIES[1], // Solo Leveling
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
    series: MOCK_SERIES[4], // Re:Zero
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
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const trending = await ContentService.getTrending(5);
   * ```
   */
  static async getTrending(limit = 10): Promise<Series[]> {
    await mockDelay();

    // Filter and sort by views (trending = high views)
    const trending = [...MOCK_SERIES]
      .filter((s) => s.views >= 10000)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    const response: StandardResponse<SeriesRaw[]> = {
      success: true,
      message: "Trending series retrieved successfully",
      data: trending,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch trending series");
    }

    return Series.fromApiArray(response.data);
  }

  /**
   * Get latest updated series
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const latest = await ContentService.getLatest(8);
   * ```
   */
  static async getLatest(limit = 10): Promise<Series[]> {
    await mockDelay();

    // Sort by updated_at (most recent first)
    const latest = [...MOCK_SERIES]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<SeriesRaw[]> = {
      success: true,
      message: "Latest series retrieved successfully",
      data: latest,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch latest series");
    }

    return Series.fromApiArray(response.data);
  }

  /**
   * Get popular series (by favorites)
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const popular = await ContentService.getPopular(10);
   * ```
   */
  static async getPopular(limit = 10): Promise<Series[]> {
    await mockDelay();

    // Sort by favorites
    const popular = [...MOCK_SERIES]
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, limit);

    const response: StandardResponse<SeriesRaw[]> = {
      success: true,
      message: "Popular series retrieved successfully",
      data: popular,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch popular series");
    }

    return Series.fromApiArray(response.data);
  }

  /**
   * Get new series (created recently)
   *
   * @param limit - Number of series to return (default: 10)
   * @example
   * ```ts
   * const newSeries = await ContentService.getNew(6);
   * ```
   */
  static async getNew(limit = 10): Promise<Series[]> {
    await mockDelay();

    // Sort by created_at (newest first)
    const newSeries = [...MOCK_SERIES]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);

    const response: StandardResponse<SeriesRaw[]> = {
      success: true,
      message: "New series retrieved successfully",
      data: newSeries,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch new series");
    }

    return Series.fromApiArray(response.data);
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
}
