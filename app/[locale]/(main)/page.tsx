/**
 * Homepage - WibuTime
 * Main landing page with featured content and sections
 */

import { ContentService } from "@/lib/api/services/content.service";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeNavigation } from "@/components/home/HomeNavigation";
import { TrendingSection } from "@/components/home/TrendingSection";
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
  // Fetch featured content list for carousel (with mock delay)
  const featuredList = await ContentService.getFeaturedList();

  // Convert model instances to plain objects for Client Component
  const featuredData = featuredList.map((item) => item.toJSON());

  // Fetch trending series (Server Component - no need to convert)
  // 10 items looks good across all screen sizes (2, 5 columns divide evenly)
  const trendingSeries = await ContentService.getTrending(10);

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection featuredList={featuredData} />

        {/* Trending Section */}
        <TrendingSection series={trendingSeries} showRanking={false} />

        {/* Container for upcoming sections */}
        <div className="container py-8">
          {/* Placeholder for remaining sections */}
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              More sections coming soon...
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              (Latest Updates, Popular, Recommended, etc.)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
