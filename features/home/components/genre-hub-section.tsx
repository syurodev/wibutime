"use client";

/**
 * Genre Hub Section Component
 * Displays popular genres with activity stats
 * Supports both Server and Client rendering via props
 */

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { GenreCard } from "@/features/genre/components/genre-card";
import type { GenreStats } from "@/features/genre/types";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface GenreHubSectionProps {
  /**
   * List of genres with stats (plain objects from cache)
   */
  readonly genres: GenreStats[];
}

export function GenreHubSection({ genres }: GenreHubSectionProps) {
  const t = useTranslations("home");

  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <Container maxWidth="xl">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("genreHub.title")}
            </h2>
            <p className="text-muted-foreground">{t("genreHub.subtitle")}</p>
          </div>

          {/* See All Link */}
          <Button variant="ghost" className="group gap-2" asChild>
            <Link href="/genres">
              {t("common.seeAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:gap-6">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </Container>
    </section>
  );
}
