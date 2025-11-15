/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 */

import { ContinueSection } from "@/components/home/ContinueSection";
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
import { getCachedHistory } from "@/lib/api/services/history/history.cached";
import type { Metadata } from "next";

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
 * Homepage Server Component
 */
export default async function HomePage() {
  // Fetch all data
  const featuredList = await getCachedFeaturedList();
  const trendingSeries = await getCachedTrending(10);
  const latestSeries = await getCachedLatest(10);
  const newSeries = await getCachedNew(10);
  const historyItems = await getCachedHistory(12);

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="min-h-screen pb-24">
        <HeroSection featuredList={featuredList} />
        <ContinueSection history={historyItems} />
        <TrendingSection series={trendingSeries} />
        <LatestUpdatesSection series={latestSeries} />
        <NewSeriesSection series={newSeries} />

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
