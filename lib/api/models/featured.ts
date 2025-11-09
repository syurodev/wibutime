/**
 * Featured Content Model - For hero/banner sections
 */

import { BaseModel } from "./base";
import { Series, type SeriesRaw } from "./series";

/**
 * Badge variant for featured content
 */
export type BadgeVariant = "new" | "hot" | "exclusive" | "trending";

/**
 * Raw featured content data from API
 */
export interface FeaturedRaw {
  id: string;
  series_id: string;
  series: SeriesRaw;
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
   * Convert to plain object (for serialization)
   */
  toJSON() {
    return {
      id: this.id,
      seriesId: this.seriesId,
      series: this.series.toJSON(),
      bannerUrl: this.bannerUrl,
      title: this.title,
      description: this.description,
      badgeText: this.badgeText,
      badgeVariant: this.badgeVariant,
      ctaPrimary: this.ctaPrimary,
      ctaSecondary: this.ctaSecondary,
      order: this.order,
    };
  }
}
