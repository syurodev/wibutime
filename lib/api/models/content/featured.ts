/**
 * Featured Content Model - For hero/banner sections
 */

import type { BadgeVariant, BaseContentData } from "./base-content";
import { BaseModel } from "../base";
import { Series, type SeriesRaw } from "./series";

/**
 * Raw featured content data from API
 * Now uses BaseContentData instead of SeriesRaw
 */
export interface FeaturedRaw {
	id: string;
	series_id: string;
	series: BaseContentData;
	banner_url: string;
	title: string;
	description: string;
	badge_text: string;
	badge_variant: BadgeVariant;
	cta_primary: string;
	cta_secondary: string;
	order: number;
}

/**
 * Featured content domain model
 */
export class Featured extends BaseModel<FeaturedRaw> {
  readonly id: string;
  readonly seriesId: string;
  readonly series: Series;
  readonly bannerUrl: string;
  readonly title: string;
  readonly description: string;
  readonly badgeText: string;
  readonly badgeVariant: BadgeVariant;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly order: number;

  constructor(raw: FeaturedRaw) {
    super(raw);

    // Map properties (snake_case → camelCase)
    this.id = raw.id;
    this.seriesId = raw.series_id;
    this.bannerUrl = raw.banner_url;
    this.title = raw.title;
    this.description = raw.description;
    this.badgeText = raw.badge_text;
    this.badgeVariant = raw.badge_variant;
    this.ctaPrimary = raw.cta_primary;
    this.ctaSecondary = raw.cta_secondary;
    this.order = raw.order;

    // Map nested series
    this.series = Series.fromApi(raw.series);
  }

  /**
   * Get badge color scheme based on variant
   */
  getBadgeColors(): { bg: string; text: string; border: string } {
    const colors: Record<
      BadgeVariant,
      { bg: string; text: string; border: string }
    > = {
      new: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
      },
      hot: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
      },
      exclusive: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
      },
      trending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
      },
    };
    return colors[this.badgeVariant];
  }

  /**
   * Convert to plain object (for serialization to Client Components)
   * Returns snake_case keys to match API convention
   */
  toJSON() {
    return {
      id: this.id,
      series_id: this.seriesId,
      series: this.series.toJSON(),
      banner_url: this.bannerUrl,
      title: this.title,
      description: this.description,
      badge_text: this.badgeText,
      badge_variant: this.badgeVariant,
      cta_primary: this.ctaPrimary,
      cta_secondary: this.ctaSecondary,
      order: this.order,
    };
  }
}
