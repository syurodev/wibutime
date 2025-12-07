/**
 * Browse Novels Page
 * Displays all novels with filters, sorting, and pagination
 */

import { SeriesGrid } from "@/components/content/SeriesGrid";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";
import { Container } from "@/components/layout/Container";
import {
  getNovelsServer,
  type BrowseNovelsQuery,
} from "@/features/novel/queries";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BrowseFilters } from "./BrowseFilters";
import { BrowseNavigation } from "./BrowseNavigation";

export const metadata: Metadata = {
  title: "Browse Novels - WibuTime",
  description:
    "Browse and discover light novels, web novels on WibuTime. Filter by genre, author, artist and more.",
  keywords: [
    "browse",
    "novels",
    "light novel",
    "web novel",
    "filter",
    "search",
    "wibutime",
  ],
};

interface BrowsePageProps {
  searchParams: Promise<{
    page?: string;
    sort_by?: string;
    sort_order?: string;
    genre_ids?: string;
    author_id?: string;
    artist_id?: string;
    owner_id?: string;
    key_search?: string;
    original_language?: string;
    status?: string;
  }>;
}

/**
 * Parse search params to query object
 */
function parseSearchParams(
  params: Awaited<BrowsePageProps["searchParams"]>
): BrowseNovelsQuery {
  return {
    page: params.page ? Number(params.page) : DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sort_by: (params.sort_by as BrowseNovelsQuery["sort_by"]) || "last_chapter",
    sort_order:
      (params.sort_order as BrowseNovelsQuery["sort_order"]) || "desc",
    genre_ids: params.genre_ids?.split(",").filter(Boolean),
    author_id: params.author_id,
    artist_id: params.artist_id,
    owner_id: params.owner_id,
    key_search: params.key_search,
    original_language: params.original_language,
    status: params.status as string,
  };
}

/**
 * Novel Grid Content (Async - for Suspense)
 */
async function NovelGridContent({ query }: { query: BrowseNovelsQuery }) {
  const { items } = await getNovelsServer(query);
  return <SeriesGrid series={items} />;
}

/**
 * Browse Novels Page Server Component
 */
export default async function BrowseNovelsPage({
  searchParams,
}: BrowsePageProps) {
  const t = await getTranslations("novel.browse");
  const params = await searchParams;
  const query = parseSearchParams(params);

  // Fetch pagination metadata
  const { total_pages, page: currentPage } = await getNovelsServer(query);

  return (
    <div className="min-h-screen py-8">
      <Container maxWidth="xl" bottomSpacing>
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Filters */}
          <BrowseFilters />
        </div>

        {/* Content Grid with Suspense */}
        <Suspense
          key={JSON.stringify(query)}
          fallback={<SeriesGridSkeleton count={DEFAULT_LIMIT} />}
        >
          <NovelGridContent query={query} />
        </Suspense>

        {/* Pagination Navigation */}
        <BrowseNavigation currentPage={currentPage} totalPages={total_pages} />
      </Container>
    </div>
  );
}
