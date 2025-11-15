/**
 * Latest Updates Page
 * Displays recently updated series with content type filters and pagination
 */

import { ContentTypeTabs } from "@/components/content/ContentTypeTabs";
import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Container } from "@/components/layout/Container";
import { ContentService } from "@/lib/api/services/base-content/content.service";
import { DEFAULT_LIMIT, type CONTENT_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LatestNavigation } from "./LatestNavigation";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "Latest Updates - WibuTime",
  description:
    "Stay up to date with the latest updates in anime, manga, and novels on WibuTime. Find recently updated series.",
  keywords: [
    "latest",
    "updates",
    "recent",
    "anime",
    "manga",
    "novel",
    "wibutime",
  ],
};

interface LatestPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
  }>;
}

/**
 * Latest Content Component (Async - for Suspense)
 */
async function LatestContent({
  type,
  page,
}: {
  type: CONTENT_TYPE | "all";
  page: number;
}) {
  // Fetch paginated latest series
  const { items } = await ContentService.getLatestPaginated({
    type,
    page,
    limit: DEFAULT_LIMIT,
  });

  return <SeriesGrid series={items} />;
}

/**
 * Latest Updates Page Server Component
 */
export default async function LatestPage({ searchParams }: LatestPageProps) {
  const t = await getTranslations("home.latest");

  // Await searchParams
  const params = await searchParams;

  // Parse URL parameters
  const type = (params.type || "all") as CONTENT_TYPE | "all";
  const page = Number(params.page) || 1;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

  // Fetch pagination metadata for navigation
  const { totalPages, currentPage } = await ContentService.getLatestPaginated({
    type: selectedType,
    page,
    limit: DEFAULT_LIMIT,
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
          <ContentTypeTabs currentType={selectedType} />
        </div>

        {/* Content with Suspense - Shows skeleton while loading */}
        <Suspense
          key={`${selectedType}-${page}`}
          fallback={<SeriesGridSkeleton count={20} />}
        >
          <LatestContent type={selectedType} page={page} />
        </Suspense>

        {/* Bottom Navigation with Pagination */}
        <LatestNavigation currentPage={currentPage} totalPages={totalPages} />
      </Container>
    </div>
  );
}
