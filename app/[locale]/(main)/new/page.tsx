/**
 * New Series Page
 * Displays newly added series with content type filters and pagination
 */

import { MediaTypeTabs } from "@/components/content/ContentTypeTabs";
import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Container } from "@/components/layout/Container";
import { ContentService } from "@/lib/api/services/base-content/content.service";
import type { MEDIA_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { NewSeriesNavigation } from "./NewSeriesNavigation";

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
  type: MEDIA_TYPE | "all";
  page: number;
}) {
  // Fetch paginated new series
  const { items } = await ContentService.getNewPaginated({
    type,
    page,
    limit: 20,
  });

  return <SeriesGrid series={items} />;
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
  const type = (params.type || "all") as MEDIA_TYPE | "all";
  const page = Number(params.page) || 1;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

  // Fetch pagination metadata for navigation
  const { totalPages, currentPage } = await ContentService.getNewPaginated({
    type: selectedType,
    page,
    limit: 20,
  });

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
          <MediaTypeTabs currentType={selectedType} />
        </div>

        {/* Content with Suspense - Shows skeleton while loading */}
        <Suspense
          key={`${selectedType}-${page}`}
          fallback={<SeriesGridSkeleton count={20} />}
        >
          <NewSeriesContent type={selectedType} page={page} />
        </Suspense>

        {/* Bottom Navigation with Pagination */}
        <NewSeriesNavigation
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Container>
    </div>
  );
}
