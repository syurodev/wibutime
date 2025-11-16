/**
 * Genre Hub Section Component
 * Displays popular genres with activity stats
 */

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { GenreStats } from "@/lib/api/models/community/genre-stats";
import { GenreStatsUtils } from "@/lib/api/models/community/genre-stats";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export interface GenreHubSectionProps {
  /**
   * List of genres with stats (plain objects from cache)
   */
  readonly genres: GenreStats[];
}

export async function GenreHubSection({ genres }: GenreHubSectionProps) {
  const t = await getTranslations("home");

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

/**
 * Individual Genre Card
 */
function GenreCard({ genre }: { readonly genre: GenreStats }) {
  // Get trend icon component
  const TrendIcon =
    genre.trend === "rising"
      ? TrendingUp
      : genre.trend === "falling"
      ? TrendingDown
      : null;

  return (
    <Link href={`/genre/${genre.id}`}>
      <div className="group relative rounded-[20px] border-4 border-secondary bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full overflow-hidden">
        {/* Gradient background overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${genre.color || "#8b5cf6"}, transparent)`,
          }}
        />

        <div className="relative p-4">
          {/* Genre Name with Trend */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-bold text-base line-clamp-1 flex-1">
              {genre.name}
            </h3>
            {TrendIcon && (
              <TrendIcon
                className={cn(
                  "size-4 shrink-0",
                  genre.trend === "rising" && "text-green-500",
                  genre.trend === "falling" && "text-red-500"
                )}
              />
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2">
            {/* Series Count */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="size-3.5" />
                <span className="text-xs">Series</span>
              </div>
              <span className="font-semibold">
                {GenreStatsUtils.formatSeriesCount(genre.series_count)}
              </span>
            </div>

            {/* Active Readers */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-3.5" />
                <span className="text-xs">Readers</span>
              </div>
              <span className="font-semibold">
                {GenreStatsUtils.formatActiveReaders(genre.active_readers)}
              </span>
            </div>
          </div>

          {/* Description (if available) */}
          {genre.description && (
            <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
              {genre.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
