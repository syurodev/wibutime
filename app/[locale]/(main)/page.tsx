/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 */

import { Skeleton } from "@/components/ui/skeleton";
import { getCachedHistory } from "@/features/history/services/history.cached";
import { CommunityMilestonesSection } from "@/features/home/components/CommunityMilestonesSection";
import { ContinueSection } from "@/features/home/components/ContinueSection";
import { GenreHubSection } from "@/features/home/components/GenreHubSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { HomeNavigation } from "@/features/home/components/HomeNavigation";
import { LatestUpdatesSection } from "@/features/home/components/LatestUpdatesSection";
import { NewSeriesSection } from "@/features/home/components/NewSeriesSection";
import { TopCreatorsSection } from "@/features/home/components/TopCreatorsSection";
import { TrendingSection } from "@/features/home/components/TrendingSection";
import {
  getCachedFeaturedList,
  getCachedLatest,
  getCachedNew,
  getCachedTrending,
} from "@/lib/api/services/base-content/content.cached";
import {
  getCachedGenreStats,
  getCachedMilestones,
  getCachedTopCreators,
} from "@/lib/api/services/community/community.cached";
import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "WibuTime - Anime, Manga & Novel Platform",
  description:
    "Discover and read the latest anime, manga, and novels. Join thousands of readers and creators on WibuTime.",
  keywords: ["anime", "manga", "novel", "read online", "wibutime"],
};

/**
 * Data Components for Suspense
 */
async function TrendingData() {
  const series = await getCachedTrending(10);
  return <TrendingSection series={series} />;
}

async function LatestData() {
  const series = await getCachedLatest(10);
  return <LatestUpdatesSection series={series} />;
}

async function NewSeriesData() {
  const series = await getCachedNew(10);
  return <NewSeriesSection series={series} />;
}

async function CommunityData() {
  const [topCreators, genreStats] = await Promise.all([
    getCachedTopCreators(8),
    getCachedGenreStats(12),
  ]);

  return (
    <>
      <TopCreatorsSection creators={topCreators} />
      <GenreHubSection genres={genreStats} />
    </>
  );
}

async function MilestonesData() {
  const milestones = await getCachedMilestones(6);
  return <CommunityMilestonesSection milestones={milestones} />;
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
 * Homepage Server Component
 */
export default async function HomePage() {
  // Fetch critical data immediately (above the fold)
  const [featuredList, historyItems] = await Promise.all([
    getCachedFeaturedList(),
    getCachedHistory(12),
  ]);

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="min-h-screen pb-24">
        {/* Hero Section - Renders immediately */}
        <HeroSection featuredList={featuredList} />

        {/* Personal Section - Renders immediately */}
        <ContinueSection history={historyItems} />

        {/* Trending Content - Streams when ready */}
        <Suspense fallback={<SectionSkeleton />}>
          <TrendingData />
        </Suspense>

        {/* Community Engagement - Streams when ready */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-8">
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          }
        >
          <CommunityData />
        </Suspense>

        {/* Latest Updates - Streams when ready */}
        <Suspense fallback={<SectionSkeleton />}>
          <LatestData />
        </Suspense>

        {/* New Series - Streams when ready */}
        <Suspense fallback={<SectionSkeleton />}>
          <NewSeriesData />
        </Suspense>

        {/* Community Milestones - Streams when ready */}
        <Suspense fallback={<SectionSkeleton />}>
          <MilestonesData />
        </Suspense>
      </div>
    </>
  );
}
