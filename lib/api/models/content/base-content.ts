/**
 * Base Content Data Model
 * Single unified data structure for all content (anime, manga, novel)
 * Plain object with no class methods - simple and serializable
 */

import type { ContentStatus, ContentType } from "@/lib/constants/default";

/**
 * Latest chapter/episode information
 */
export interface LatestChapter {
	number: number;
	title: string;
	published_at: string;
}

/**
 * Base Content Data - The single source of truth for content structure
 * This replaces both Series class and SeriesData interface
 */
export interface BaseContentData {
	// Basic info
	id: string;
	title: string;
	slug: string;
	description: string;
	cover_url: string;
	type: ContentType;
	status: ContentStatus;
	genres: string[];

	// Stats
	rating: number;
	views: number;
	favorites: number;

	// Latest update
	latest_chapter: LatestChapter | null;

	// Timestamps
	created_at: string;
	updated_at: string;
}

/**
 * Helper functions for formatting content data
 */
export const ContentFormatter = {
	/**
	 * Format rating (e.g., "4.5" or "N/A")
	 */
	formatRating(rating: number): string {
		return rating > 0 ? rating.toFixed(1) : "N/A";
	},

	/**
	 * Format view count (e.g., "1.2K", "3.4M")
	 */
	formatViews(views: number): string {
		if (views >= 1000000) {
			return `${(views / 1000000).toFixed(1)}M`;
		}
		if (views >= 1000) {
			return `${(views / 1000).toFixed(1)}K`;
		}
		return views.toString();
	},

	/**
	 * Format favorites count
	 */
	formatFavorites(favorites: number): string {
		if (favorites >= 1000000) {
			return `${(favorites / 1000000).toFixed(1)}M`;
		}
		if (favorites >= 1000) {
			return `${(favorites / 1000).toFixed(1)}K`;
		}
		return favorites.toString();
	},

	/**
	 * Check if content is new (created within last 7 days)
	 */
	isNew(created_at: string): boolean {
		const now = new Date();
		const createdDate = new Date(created_at);
		const daysDiff = Math.floor(
			(now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		return daysDiff <= 7;
	},

	/**
	 * Check if content is trending (high view count)
	 */
	isTrending(views: number): boolean {
		return views >= 10000;
	},

	/**
	 * Check if content has recent updates (within last 3 days)
	 */
	hasRecentUpdate(updated_at: string): boolean {
		const now = new Date();
		const updatedDate = new Date(updated_at);
		const daysDiff = Math.floor(
			(now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		return daysDiff <= 3;
	},

	/**
	 * Get latest chapter info formatted
	 */
	formatLatestChapter(latestChapter: LatestChapter | null): string | null {
		if (!latestChapter) return null;
		return `Ch. ${latestChapter.number}: ${latestChapter.title}`;
	},

	/**
	 * Get status label in localized language
	 */
	getStatusLabel(status: ContentStatus, locale: string = "en"): string {
		const labels: Record<ContentStatus, Record<string, string>> = {
			ongoing: { en: "Ongoing", vi: "Đang tiến hành" },
			completed: { en: "Completed", vi: "Hoàn thành" },
			hiatus: { en: "Hiatus", vi: "Tạm ngưng" },
		};
		return labels[status][locale] || labels[status].en;
	},

	/**
	 * Get type label
	 */
	getTypeLabel(type: ContentType, locale: string = "en"): string {
		const labels: Record<ContentType, Record<string, string>> = {
			anime: { en: "Anime", vi: "Anime" },
			manga: { en: "Manga", vi: "Manga" },
			novel: { en: "Novel", vi: "Tiểu thuyết" },
		};
		return labels[type][locale] || labels[type].en;
	},
};
