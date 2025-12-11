"use client";

import { ContentCard } from "@/components/content/content-card";
import { Container } from "@/components/layout/container";
import { MediaSeries } from "@/features/content/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TrendingSectionProps {
  readonly series: MediaSeries[];
  readonly className?: string;
}

export function TrendingSection({ series, className }: TrendingSectionProps) {
  const t = useTranslations("common.sections");

  if (!series || series.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("trending") || "Trending Now"}
        </h2>
        {/* View all link could go here */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {series.map((item, index) => (
          <ContentCard
            key={item.id}
            series={item}
            className={cn(
              // CSS trick for 20 items:
              // Mobile (2 cols): Show all 20 -> OK
              // Tablet (3 cols): 20/3 dư 2 -> Hide last 2 items
              // Desktop (5 cols): Show all 20 -> OK
              // Logic:
              // Index >= 18 (items 19, 20)
              // Hidden on md (`hidden`) BUT Visible on lg (`lg:block`) AND Visible on default mobile (`block`)
              index >= 18 ? "md:hidden lg:block" : ""
            )}
          />
        ))}
      </div>
    </Container>
  );
}
