/**
 * Type definitions for serialized content data
 * These types represent plain objects returned from cached services
 * Used for passing data from Server Components to Client Components
 */

import type { CONTENT_TYPE } from "@/lib/constants/default";
import type { BadgeVariant } from "./featured";

/**
 * Serialized Series data (plain object)
 * Output format from Series.toJSON()
 */
export interface SeriesData {
	id: string;
	title: string;
	slug: string;
	description: string;
	cover_url: string;
	type: CONTENT_TYPE;
	status: string;
	genres: string[];
	rating: number;
	formatted_rating: string;
	views: number;
	formatted_views: string;
	favorites: number;
	formatted_favorites: string;
	latest_chapter: {
		number: number;
		title: string;
		published_at: string;
	} | null;
	latest_chapter_info: string | null;
	created_at: string;
	updated_at: string;
	is_new: boolean;
	is_trending: boolean;
	has_recent_update: boolean;
}

/**
 * Serialized Featured data (plain object)
 * Output format from Featured.toJSON()
 */
export interface FeaturedData {
	id: string;
	series_id: string;
	series: SeriesData;
	banner_url: string;
	title: string;
	description: string;
	badge_text: string;
	badge_variant: BadgeVariant;
	cta_primary: string;
	cta_secondary: string;
	order: number;
}
