/**
 * New Series Page
 * Displays newly added series with content type filters and pagination
 */

import { Container } from "@/components/layout/Container";
import { ContentTypeTabs } from "@/components/content/ContentTypeTabs";
import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesPagination } from "@/components/content/SeriesPagination";
import { ContentService } from "@/lib/api/services/content.service";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "New Series - WibuTime",
  description:
    "Explore newly added anime, manga, and novels on WibuTime. Discover fresh content added to our platform.",
  keywords: ["new", "fresh", "anime", "manga", "novel", "wibutime"],
};

interface NewSeriesPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
  }>;
}

/**
 * New Series Content Component (Async - for Suspense)
 */
async function NewSeriesContent({
  type,
  page,
}: {
  type: CONTENT_TYPE | "all";
  page: number;
}) {
  // Fetch paginated new series
  const { items, totalPages, currentPage } =
    await ContentService.getNewPaginated({
      type,
      page,
      limit: 20,
    });

  return (
    <>
      {/* Series Grid */}
      <SeriesGrid
        series={items}
        showContentType={true}
        showDescription={true}
        className="mb-8"
      />

      {/* Pagination */}
      <SeriesPagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}

/**
 * New Series Page Server Component
 */
export default async function NewSeriesPage({
  searchParams,
}: NewSeriesPageProps) {
  const t = await getTranslations("home.newSeries");

  // Await searchParams
  const params = await searchParams;

  // Parse URL parameters
  const type = (params.type || "all") as CONTENT_TYPE | "all";
  const page = Number(params.page) || 1;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

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
          fallback={
            <>
              <SeriesGridSkeleton count={20} className="mb-8" />
              <div className="flex justify-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-24" />
              </div>
            </>
          }
        >
          <NewSeriesContent type={selectedType} page={page} />
        </Suspense>
      </Container>
    </div>
  );
}
