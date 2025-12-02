/**
 * Library Page - User's personal collection
 * Displays saved anime, manga, and novels with filters, sorting and pagination
 */

import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Container } from "@/components/layout/Container";
import { getLibraryPaginated } from "@/features/library/api/queries";
import { LibraryEmpty } from "@/features/library/components/LibraryEmpty";
import {
  LibraryFilters,
  type SortOption,
} from "@/features/library/components/LibraryFilters";
import { LibraryStats } from "@/features/library/components/LibraryStats";
import type { MEDIA_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LibraryNavigation } from "./LibraryNavigation";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "My Library - WibuTime",
  description:
    "Your personal collection of anime, manga, and novels on WibuTime",
  keywords: ["library", "collection", "saved", "bookmarks", "wibutime"],
};

interface LibraryPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
    sort?: string;
  }>;
}

/**
 * Library Content Component (Async - for Suspense)
 */
async function LibraryContent({
  type,
  page,
  sort,
}: {
  type: MEDIA_TYPE | "all";
  page: number;
  sort: SortOption;
}) {
  // Fetch paginated library series
  const { items } = await getLibraryPaginated({
    type,
    page,
    limit: 15,
    sort,
  });

  return <SeriesGrid series={items} />;
}

/**
 * Library Page Server Component
 */
export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const t = await getTranslations("library");

  // Await searchParams
  const params = await searchParams;

  // Parse URL parameters
  const type = (params.type || "all") as MEDIA_TYPE | "all";
  const page = Number(params.page) || 1;
  const sort = (params.sort || "recent") as SortOption;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

  // Validate sort
  const validSorts = ["recent", "title", "updated", "rating"];
  const selectedSort = validSorts.includes(sort) ? sort : "recent";

  // Fetch pagination metadata for navigation
  const { totalPages, currentPage, totalItems } = await getLibraryPaginated({
    type: selectedType,
    page,
    limit: 15,
    sort: selectedSort as SortOption,
  });

  // Check if library is empty
  const hasContent = totalItems > 0;

  // TODO: Replace with actual user stats from API
  const userStats = {
    total: totalItems,
    reading: Math.floor(totalItems * 0.4),
    completed: Math.floor(totalItems * 0.3),
    planToRead: Math.floor(totalItems * 0.3),
  };

  return (
    <div className="min-h-screen py-8">
      <Container maxWidth="xl" bottomSpacing>
        {/* Page Header */}
        <div className="mb-8 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Stats Section */}
          {hasContent && <LibraryStats stats={userStats} />}

          {/* Filters */}
          {hasContent && (
            <LibraryFilters
              currentType={selectedType}
              currentSort={selectedSort}
            />
          )}
        </div>

        {/* Content Section */}
        {hasContent ? (
          <>
            {/* Content with Suspense - Shows skeleton while loading */}
            <Suspense
              key={`${selectedType}-${page}-${selectedSort}`}
              fallback={<SeriesGridSkeleton count={15} />}
            >
              <LibraryContent
                type={selectedType}
                page={page}
                sort={selectedSort}
              />
            </Suspense>

            {/* Bottom Navigation with Pagination */}
            <LibraryNavigation
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        ) : (
          <LibraryEmpty />
        )}
      </Container>
    </div>
  );
}
