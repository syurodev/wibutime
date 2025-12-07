/**
 * History Page
 * Displays user's viewing history with content type filters, sorting and pagination
 */

import { Container } from "@/components/layout/Container";
import { type HistorySortOption } from "@/features/history/components/HistoryFilters";
import type { MEDIA_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "History - WibuTime",
  description:
    "View your watching and reading history on WibuTime. Pick up where you left off.",
  keywords: ["history", "continue watching", "continue reading", "wibutime"],
};

interface HistoryPageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
    sort?: string;
  }>;
}

/**
 * History Content Component (Async - for Suspense)
 */
// async function HistoryContent({
//   type,
//   page,
//   sort,
// }: {
//   type: MEDIA_TYPE | "all";
//   page: number;
//   sort: HistorySortOption;
// }) {
//   // Fetch paginated history
//   const { items } = await HistoryService.getHistoryPaginated({
//     type,
//     page,
//     limit: 15,
//     sort,
//   });
//   const currentTime = await getCurrentTime();

//   return <HistoryGrid history={items} currentTime={currentTime} />;
// }

/**
 * History Page Server Component
 */
export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const t = await getTranslations("history");

  // Await searchParams
  const params = await searchParams;

  // Parse URL parameters
  const type = (params.type || "all") as MEDIA_TYPE | "all";
  const page = Number(params.page) || 1;
  const sort = (params.sort || "recent") as HistorySortOption;

  // Validate type
  const validTypes = ["all", "anime", "manga", "novel"];
  const selectedType = validTypes.includes(type) ? type : "all";

  // Validate sort
  const validSorts = ["recent", "title", "updated"];
  const selectedSort = validSorts.includes(sort) ? sort : "recent";

  // Fetch pagination metadata for navigation
  // const { totalPages, currentPage, totalItems } =
  //   await HistoryService.getHistoryPaginated({
  //     type: selectedType,
  //     page,
  //     limit: 15,
  //     sort: selectedSort as HistorySortOption,
  //   });

  // Check if history is empty
  // const hasContent = totalItems > 0;

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

          {/* Filters */}
          {/* {hasContent && (
            <HistoryFilters
              currentType={selectedType}
              currentSort={selectedSort}
            />
          )} */}
        </div>

        {/* Content Section */}
        {/* {hasContent ? (
          <>
            <Suspense
              key={`${selectedType}-${page}-${selectedSort}`}
              fallback={<HistoryGridSkeleton count={15} />}
            >
              <HistoryContent
                type={selectedType}
                page={page}
                sort={selectedSort}
              />
            </Suspense>

            <HistoryNavigation
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        ) : (
          <HistoryEmpty />
        )} */}
      </Container>
    </div>
  );
}
