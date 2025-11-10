/**
 * Base Series Model
 * Shared properties and methods for all content types (anime, manga, novel)
 */

import { BaseModel } from "../base";
import type { ContentStatus, ContentType, LatestChapterRaw } from "@/lib/constants/default";

/**
 * Raw series data from API (base structure)
 */
export interface SeriesRaw {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  type: ContentType;
  status: ContentStatus;
  genres: string[];
  rating: number; // 0-5
  views: number;
  favorites: number;
  latest_chapter?: LatestChapterRaw;
  created_at: string;
  updated_at: string;
}

/**
 * Base Series domain model
 * Contains shared logic for all content types
 */
export class Series extends BaseModel<SeriesRaw> {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly coverUrl: string;
  readonly type: ContentType;
  readonly status: ContentStatus;
  readonly genres: string[];
  readonly rating: number;
  readonly views: number;
  readonly favorites: number;
  readonly latestChapter: LatestChapterRaw | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(raw: SeriesRaw) {
    super(raw);

    // Map properties (snake_case → camelCase)
    this.id = raw.id;
    this.title = raw.title;
    this.slug = raw.slug;
    this.description = raw.description;
    this.coverUrl = raw.cover_url;
    this.type = raw.type;
    this.status = raw.status;
    this.genres = raw.genres || [];
    this.rating = raw.rating;
    this.views = raw.views;
    this.favorites = raw.favorites;
    this.latestChapter = raw.latest_chapter || null;

    // Parse dates
    this.createdAt = new Date(raw.created_at);
    this.updatedAt = new Date(raw.updated_at);
  }

  /**
   * Get formatted rating (e.g., "4.5" or "N/A")
   */
  get formattedRating(): string {
    return this.rating > 0 ? this.rating.toFixed(1) : "N/A";
  }

  /**
   * Get formatted view count (e.g., "1.2K", "3.4M")
   */
  get formattedViews(): string {
    if (this.views >= 1000000) {
      return `${(this.views / 1000000).toFixed(1)}M`;
    }
    if (this.views >= 1000) {
      return `${(this.views / 1000).toFixed(1)}K`;
    }
    return this.views.toString();
  }

  /**
   * Get formatted favorites count
   */
  get formattedFavorites(): string {
    if (this.favorites >= 1000000) {
      return `${(this.favorites / 1000000).toFixed(1)}M`;
    }
    if (this.favorites >= 1000) {
      return `${(this.favorites / 1000).toFixed(1)}K`;
    }
    return this.favorites.toString();
  }

  /**
   * Check if series is new (created within last 7 days)
   */
  get isNew(): boolean {
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 7;
  }

  /**
   * Check if series is trending (high view count)
   */
  get isTrending(): boolean {
    return this.views >= 10000;
  }

  /**
   * Check if series has recent updates (within last 3 days)
   */
  get hasRecentUpdate(): boolean {
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - this.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 3;
  }

  /**
   * Get genre labels as comma-separated string
   */
  get genreLabels(): string {
    return this.genres.join(", ");
  }

  /**
   * Get status label in localized language
   */
  getStatusLabel(locale: string = "en"): string {
    const labels: Record<ContentStatus, Record<string, string>> = {
      ongoing: { en: "Ongoing", vi: "Đang tiến hành" },
      completed: { en: "Completed", vi: "Hoàn thành" },
      hiatus: { en: "Hiatus", vi: "Tạm ngưng" },
    };
    return labels[this.status][locale] || labels[this.status].en;
  }

  /**
   * Get type label
   */
  getTypeLabel(locale: string = "en"): string {
    const labels: Record<ContentType, Record<string, string>> = {
      anime: { en: "Anime", vi: "Anime" },
      manga: { en: "Manga", vi: "Manga" },
      novel: { en: "Novel", vi: "Tiểu thuyết" },
    };
    return labels[this.type][locale] || labels[this.type].en;
  }

  /**
   * Get latest chapter info formatted
   */
  get latestChapterInfo(): string | null {
    if (!this.latestChapter) return null;
    return `Ch. ${this.latestChapter.number}: ${this.latestChapter.title}`;
  }

  /**
   * Convert to plain object (for serialization to Client Components)
   * Returns snake_case keys to match API convention
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      cover_url: this.coverUrl,
      type: this.type,
      status: this.status,
      genres: this.genres,
      rating: this.rating,
      formatted_rating: this.formattedRating,
      views: this.views,
      formatted_views: this.formattedViews,
      favorites: this.favorites,
      formatted_favorites: this.formattedFavorites,
      latest_chapter: this.latestChapter,
      latest_chapter_info: this.latestChapterInfo,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      is_new: this.isNew,
      is_trending: this.isTrending,
      has_recent_update: this.hasRecentUpdate,
    };
  }
}
