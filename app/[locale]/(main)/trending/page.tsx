/**
 * Trending Page
 * Displays trending series with content type filters and pagination
 */

import { ContentTypeTabs } from "@/components/content/ContentTypeTabs";
import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Container } from "@/components/layout/Container";
import { ContentService } from "@/lib/api/services/base-content/content.service";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { TrendingNavigation } from "./TrendingNavigation";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "Trending - WibuTime",
  description:
    "Discover the most trending anime, manga, and novels on WibuTime. See what everyone is reading right now.",
  keywords: ["trending", "popular", "anime", "manga", "novel", "wibutime"],
};

interface TrendingPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
  }>;
}

/**
 * Trending Content Component (Async - for Suspense)
 */
async function TrendingContent({
  type,
  page,
}: {
  type: CONTENT_TYPE | "all";
  page: number;
}) {
  // Fetch paginated trending series
  const { items } = await ContentService.getTrendingPaginated({
    type,
    page,
    limit: 15,
  });

  return (
    <SeriesGrid series={items} showContentType={true} showDescription={true} />
  );
}

/**
 * Trending Page Server Component
 */
export default async function TrendingPage({
  searchParams,
}: TrendingPageProps) {
  const t = await getTranslations("home.trending");

  // Await searchParams
  const params = await searchParams;

  // Parse URL parameters
  const type = (params.type || "all") as CONTENT_TYPE | "all";
  const page = Number(params.page) || 1;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

  // Fetch pagination metadata for navigation
  const { totalPages, currentPage } = await ContentService.getTrendingPaginated(
    {
      type: selectedType,
      page,
      limit: 10,
    }
  );

  return (
    <div className="min-h-screen py-8">
      <Container maxWidth="xl" bottomSpacing>
        {/* Page Header - Renders immediately */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Content Type Filter */}
          <ContentTypeTabs currentType={selectedType} />
        </div>

        {/* Content with Suspense - Shows skeleton while loading */}
        <Suspense
          key={`${selectedType}-${page}`}
          fallback={<SeriesGridSkeleton count={20} />}
        >
          <TrendingContent type={selectedType} page={page} />
        </Suspense>

        {/* Bottom Navigation with Pagination */}
        <TrendingNavigation currentPage={currentPage} totalPages={totalPages} />
      </Container>
    </div>
  );
}
