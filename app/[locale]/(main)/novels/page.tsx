/**
 * Novels Landing Page
 * Dedicated page for novel content
 */

import { Skeleton } from "@/components/ui/skeleton";
import { getCachedHistory } from "@/features/history/services/history.cached";
import { ContinueSection } from "@/features/home/components/ContinueSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { LatestUpdatesSection } from "@/features/home/components/LatestUpdatesSection";
import { NewSeriesSection } from "@/features/home/components/NewSeriesSection";
import { TrendingSection } from "@/features/home/components/TrendingSection";
import {
  getCachedFeaturedNovels,
  getCachedLatestNovels,
  getCachedNewNovels,
  getCachedTrendingNovels,
} from "@/lib/api/services/novel/novel.cached";
import { MEDIA_TYPE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "Novels - WibuTime",
  description:
    "Read the best light novels, web novels, and original fiction on WibuTime.",
  keywords: ["novel", "light novel", "web novel", "read online", "wibutime"],
};

/**
 * Data Components for Suspense
 */
async function TrendingData() {
  const series = await getCachedTrendingNovels(10);
  return <TrendingSection series={series} />;
}

async function LatestData() {
  const series = await getCachedLatestNovels(10);
  return <LatestUpdatesSection series={series} />;
}

async function NewSeriesData() {
  const series = await getCachedNewNovels(10);
  return <NewSeriesSection series={series} />;
}

/**
 * Section Skeleton Components
 */
function SectionSkeleton({ title }: { title?: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {title && <Skeleton className="h-8 w-48 mb-6" />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => `skeleton-${i}`).map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Novels Page Server Component
 */
export default async function NovelsPage() {
  // Fetch critical data immediately (above the fold)
  const [featuredList, historyItems] = await Promise.all([
    getCachedFeaturedNovels(),
    getCachedHistory(12),
  ]);

  // Filter history for novels only
  const novelHistory = historyItems.filter(
    (item) => item.type === MEDIA_TYPE.NOVEL
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section - Renders immediately */}
      <HeroSection featuredList={featuredList} />

      {/* Personal Section - Renders immediately */}
      {novelHistory.length > 0 && <ContinueSection history={novelHistory} />}

      {/* Trending Content - Streams when ready */}
      <Suspense fallback={<SectionSkeleton title="Trending Novels" />}>
        <TrendingData />
      </Suspense>

      {/* Latest Updates - Streams when ready */}
      <Suspense fallback={<SectionSkeleton title="Latest Updates" />}>
        <LatestData />
      </Suspense>

      {/* New Series - Streams when ready */}
      <Suspense fallback={<SectionSkeleton title="New Arrivals" />}>
        <NewSeriesData />
      </Suspense>
    </div>
  );
}
