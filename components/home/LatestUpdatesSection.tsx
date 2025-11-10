/**
 * Latest Updates Section Component
 * Displays recently updated series in a grid layout
 */

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import type { Series } from "@/lib/api/models/content/series";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ContentCard, type SeriesData } from "@/components/content/ContentCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface LatestUpdatesSectionProps {
  /**
   * List of recently updated series
   */
  readonly series: Series[];

  /**
   * Show ranking numbers on items
   */
  readonly showRanking?: boolean;
}

export async function LatestUpdatesSection({
  series,
}: LatestUpdatesSectionProps) {
  const t = await getTranslations("home");

  if (!series || series.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <Container maxWidth="xl">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("latest.title")}
            </h2>
            <p className="text-muted-foreground">{t("latest.subtitle")}</p>
          </div>

          {/* See All Link */}
          <Button variant="ghost" className="group gap-2" asChild>
            <Link href="/latest">
              {t("common.seeAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {series.map((item) => (
            <AspectRatio key={item.id} ratio={3 / 5} className="w-full">
              <ContentCard
                series={item.toJSON() as SeriesData}
                showDescription={true}
                className="h-full"
                showContentType={true}
              />
            </AspectRatio>
          ))}
        </div>
      </Container>
    </section>
  );
}
