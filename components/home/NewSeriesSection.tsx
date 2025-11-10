/**
 * New Series Section Component
 * Displays recently added series in a grid layout
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { TrendingItem } from "./TrendingItem";
import type { Series } from "@/lib/api/models/series";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export interface NewSeriesSectionProps {
  /**
   * List of new series
   */
  series: Series[];

  /**
   * Show ranking numbers on items
   */
  showRanking?: boolean;
}

export async function NewSeriesSection({
  series,
  showRanking = false,
}: NewSeriesSectionProps) {
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
              {t("newSeries.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("newSeries.subtitle")}
            </p>
          </div>

          {/* See All Link */}
          <Button variant="ghost" className="group gap-2" asChild>
            <Link href="/new">
              {t("common.seeAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {series.map((item, index) => (
            <TrendingItem
              key={item.id}
              series={item}
              rank={showRanking ? index + 1 : undefined}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
