/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 */

import { HeroSection } from "@/components/home/HeroSection";
import { HomeNavigation } from "@/components/home/HomeNavigation";
import { LatestUpdatesSection } from "@/components/home/LatestUpdatesSection";
import { NewSeriesSection } from "@/components/home/NewSeriesSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { ContentService } from "@/lib/api/services/content.service";
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
  // Fetch all data in parallel for better performance
  const [featuredList, trendingSeries, latestSeries, newSeries] =
    await Promise.all([
      ContentService.getFeaturedList(),
      ContentService.getTrending(10),
      ContentService.getLatest(10),
      ContentService.getNew(10),
    ]);

  // Convert model instances to plain objects for Client Component
  const featuredData = featuredList.map((item) => item.toJSON());

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="min-h-screen pb-24">
        {/* Hero Section */}
        <HeroSection featuredList={featuredData} />

        {/* Trending Section */}
        <TrendingSection series={trendingSeries} />

        {/* Latest Updates Section */}
        <LatestUpdatesSection series={latestSeries} />

        {/* New Series Section */}
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
