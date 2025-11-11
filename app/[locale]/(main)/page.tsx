/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 * Optimized with Cache Components and Suspense boundaries
 */

import { HeroSection } from "@/components/home/HeroSection";
import { HomeNavigation } from "@/components/home/HomeNavigation";
import { LatestUpdatesSection } from "@/components/home/LatestUpdatesSection";
import { NewSeriesSection } from "@/components/home/NewSeriesSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import {
  getCachedFeaturedList,
  getCachedLatest,
  getCachedNew,
  getCachedTrending,
} from "@/lib/api/services/base-content/content.cached";
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
 * Skeleton component for loading states
 */
function SectionSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-2/3 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Featured Section Component (Cached)
 */
async function FeaturedSection() {
  // Data is already converted to plain objects in cached function
  const featuredList = await getCachedFeaturedList();
  return <HeroSection featuredList={featuredList} />;
}

/**
 * Trending Section Component (Cached)
 */
async function CachedTrendingSection() {
  // Data is already converted to plain objects in cached function
  const trendingSeries = await getCachedTrending(10);
  return <TrendingSection series={trendingSeries} />;
}

/**
 * Latest Updates Section Component (Cached)
 */
async function CachedLatestUpdatesSection() {
  // Data is already converted to plain objects in cached function
  const latestSeries = await getCachedLatest(10);
  return <LatestUpdatesSection series={latestSeries} />;
}

/**
 * New Series Section Component (Cached)
 */
async function CachedNewSeriesSection() {
  // Data is already converted to plain objects in cached function
  const newSeries = await getCachedNew(10);
  return <NewSeriesSection series={newSeries} />;
}

/**
 * Homepage Server Component with Streaming
 */
export default function HomePage() {
  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content with Suspense Boundaries */}
      <div className="min-h-screen pb-24">
        {/* Hero Section - Streams independently */}
        <Suspense
          fallback={
            <div className="h-[600px] bg-muted animate-pulse rounded-lg mx-4 my-8" />
          }
        >
          <FeaturedSection />
        </Suspense>

        {/* Trending Section - Streams independently */}
        <Suspense fallback={<SectionSkeleton />}>
          <CachedTrendingSection />
        </Suspense>

        {/* Latest Updates Section - Streams independently */}
        <Suspense fallback={<SectionSkeleton />}>
          <CachedLatestUpdatesSection />
        </Suspense>

        {/* New Series Section - Streams independently */}
        <Suspense fallback={<SectionSkeleton />}>
          <CachedNewSeriesSection />
        </Suspense>

        {/* Container for upcoming sections */}
        <div className="container py-8 mx-auto">
          {/* Placeholder for remaining sections */}
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              More sections coming soon...
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              (Popular, Recommended, etc.)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
