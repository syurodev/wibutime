/**
 * Hero Section Component
 * Featured content banner at the top of homepage
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Container } from "@/components/layout/Container";
import { ContentBadge } from "@/components/content/ContentBadge";
import { GenreTag } from "@/components/content/GenreTag";
import type { BadgeVariant } from "@/lib/api/models/featured";
import { Eye, Heart, Star, Play, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Plain object type for featured content (for Client Component)
 */
export interface FeaturedData {
  id: string;
  seriesId: string;
  series: {
    id: string;
    title: string;
    slug: string;
    genres: string[];
    formattedRating: string;
    formattedViews: string;
    formattedFavorites: string;
    hasRecentUpdate: boolean;
  };
  bannerUrl: string;
  title: string;
  description: string;
  badgeText: string;
  badgeVariant: BadgeVariant;
  ctaPrimary: string;
  ctaSecondary: string;
  order: number;
}

export interface HeroSectionProps {
  /**
   * Featured content data (plain object)
   */
  featured: FeaturedData;
}

export function HeroSection({ featured }: HeroSectionProps) {
  const t = useTranslations("home");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <AspectRatio ratio={16 / 9} className="md:aspect-[21/9]">
        <div className="relative h-full w-full">
          <Image
            src={featured.bannerUrl}
            alt={featured.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>
      </AspectRatio>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <Container maxWidth="xl" className="w-full pb-8 md:pb-16">
          <div className="space-y-4 md:space-y-6">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <ContentBadge
                text={featured.badgeText}
                variant={featured.badgeVariant}
                className="text-xs md:text-sm"
              />
              {featured.series.hasRecentUpdate && (
                <ContentBadge
                  text={t("hero.new")}
                  variant="new"
                  className="text-xs md:text-sm"
                />
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-lg">
              {featured.title}
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg line-clamp-3 drop-shadow-md">
              {featured.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {/* Genres */}
              {featured.series.genres.slice(0, 3).map((genre) => (
                <GenreTag
                  key={genre}
                  genre={genre}
                  className="bg-white/20 border-white/30 hover:bg-white/30"
                />
              ))}

              {/* Stats */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <span>{featured.series.formattedRating}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{featured.series.formattedViews}</span>
              </div>

              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{featured.series.formattedFavorites}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="gap-2 font-semibold"
                asChild
              >
                <Link href={`/series/${featured.series.slug}`}>
                  <Play className="h-5 w-5" />
                  {featured.ctaPrimary}
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold bg-white/10 border-white/30 hover:bg-white/20"
              >
                <Plus className="h-5 w-5" />
                {featured.ctaSecondary}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
