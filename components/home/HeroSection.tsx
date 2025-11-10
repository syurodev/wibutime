/**
 * Hero Section Component
 * Featured content carousel at the top of homepage
 */

"use client";

import { ContentBadge } from "@/components/content/ContentBadge";
import { GenreTag } from "@/components/content/GenreTag";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { BadgeVariant } from "@/lib/api/models/content/featured";
import Autoplay from "embla-carousel-autoplay";
import { Eye, Heart, Play, Plus, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

/**
 * Plain object type for featured content (for Client Component)
 * Using snake_case to match toJSON() output
 */
export interface FeaturedData {
  id: string;
  series_id: string;
  series: {
    id: string;
    title: string;
    slug: string;
    genres: string[];
    formatted_rating: string;
    formatted_views: string;
    formatted_favorites: string;
    has_recent_update: boolean;
  };
  banner_url: string;
  title: string;
  description: string;
  badge_text: string;
  badge_variant: BadgeVariant;
  cta_primary: string;
  cta_secondary: string;
  order: number;
}

export interface HeroSectionProps {
  /**
   * List of featured content for carousel
   */
  featuredList: FeaturedData[];
}

export function HeroSection({ featuredList }: HeroSectionProps) {
  const plugin = useRef(Autoplay({ delay: 15000, stopOnInteraction: true }));

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {featuredList.map((featured) => (
            <CarouselItem key={featured.id} className="pl-0">
              <HeroSlide featured={featured} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
        <CarouselPrevious className="hidden md:flex left-4 md:left-8 size-10 bg-background/20 backdrop-blur-sm border-white/30 hover:bg-background/40" />
        <CarouselNext className="hidden md:flex right-4 md:right-8 size-10 bg-background/20 backdrop-blur-sm border-white/30 hover:bg-background/40" />
      </Carousel>
    </section>
  );
}

/**
 * Individual Hero Slide Component
 */
function HeroSlide({ featured }: { featured: FeaturedData }) {
  const t = useTranslations("home");

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full">
      {/* Background Image */}
      <div className="relative h-full w-full">
        <Image
          src={featured.banner_url}
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

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <Container maxWidth="xl" className="w-full py-12 md:py-20 lg:py-24">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <ContentBadge
                text={featured.badge_text}
                variant={featured.badge_variant}
                className="text-xs md:text-sm"
              />
              {featured.series.has_recent_update && (
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
                <span>{featured.series.formatted_rating}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{featured.series.formatted_views}</span>
              </div>

              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{featured.series.formatted_favorites}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="gap-2 font-semibold" asChild>
                <Link href={`/series/${featured.series.slug}`}>
                  <Play className="h-5 w-5" />
                  {featured.cta_primary}
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold bg-white/10 border-white/30 hover:bg-white/20"
              >
                <Plus className="h-5 w-5" />
                {featured.cta_secondary}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
