/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 */

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
  // Fetch all data in parallel
  const [
    featuredList,
    trendingSeries,
    latestSeries,
    newSeries,
    historyItems,
    topCreators,
    genreStats,
    milestones,
  ] = await Promise.all([
    getCachedFeaturedList(),
    getCachedTrending(10),
    getCachedLatest(10),
    getCachedNew(10),
    getCachedHistory(12),
    getCachedTopCreators(8),
    getCachedGenreStats(12),
    getCachedMilestones(6),
  ]);

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="min-h-screen pb-24">
        {/* Hero Section */}
        <HeroSection featuredList={featuredList} />

        {/* Personal Section */}
        <ContinueSection history={historyItems} />

        {/* Trending Content */}
        <TrendingSection series={trendingSeries} />

        {/* Community Engagement - Top Creators & Genre Hub Split Layout */}
        <TopCreatorsSection creators={topCreators} />
        <GenreHubSection genres={genreStats} />

        {/* Latest Updates */}
        <LatestUpdatesSection series={latestSeries} />

        {/* New Series */}
        <NewSeriesSection series={newSeries} />

        {/* Community Milestones */}
        <CommunityMilestonesSection milestones={milestones} />
      </div>
    </>
  );
}
