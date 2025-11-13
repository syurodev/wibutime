/**
 * Hero Section Component
 * Featured content carousel at the top of homepage
 */

"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import Autoplay from "embla-carousel-autoplay";
import { Eye, Heart, Play, Plus, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { BasicStaticEditorView } from "../editor/basic-static-editor-view";
import { Badge } from "../ui/badge";

export interface HeroSectionProps {
  /**
   * List of featured content for carousel
   */
  readonly featuredList: MediaSeries[];
}

export function HeroSection({ featuredList }: HeroSectionProps) {
  const plugin = useMemo(
    () => Autoplay({ delay: 15000, stopOnInteraction: true }),
    []
  );

  console.log(featuredList);

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={[plugin]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.stop}
        onMouseLeave={plugin.reset}
      >
        <CarouselContent className="ml-0">
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
function HeroSlide({ featured }: { readonly featured: MediaSeries }) {
  const t = useTranslations("home");

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full">
      {/* Background Image */}
      <div className="relative h-full w-full">
        <Image
          src={featured.cover_url}
          alt={featured.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <Container maxWidth="xl" className="w-full py-12 md:py-20 lg:py-24">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-lg">
              {featured.title}
            </h1>

            {/* Description */}
            <BasicStaticEditorView
              content={featured.description}
              maxLines={6}
            />

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {/* Genres */}
              {featured.genres.slice(0, 3).map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}

              {/* Stats */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <span>{formatNumberAbbreviated(featured.rating)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumberAbbreviated(featured.views)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{formatNumberAbbreviated(featured.favorites)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className={cn(
                  "gap-2 font-semibold",
                  getContentBg({ type: featured.type, blur: false })
                )}
                asChild
              >
                <Link href={`/series/${featured.slug}`}>
                  <Play className="h-5 w-5" />
                  {featured.latest_chapter?.title}
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold bg-white/10 border-white/30 hover:bg-white/20"
              >
                <Plus className="h-5 w-5" />
                {t("common.addToLibrary")}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
