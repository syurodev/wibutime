/**
 * Homepage - WibuTime
 * Hero section only, other sections are parallel routes
 */

import { getHeroFeatured } from "@/features/content";
import { HeroSection } from "@/features/home/components/HeroSection";
import { HomeNavigation } from "@/features/home/components/HomeNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WibuTime - Anime, Manga & Novel Platform",
  description:
    "Discover and read the latest anime, manga, and novels. Join thousands of readers and creators on WibuTime.",
  keywords: ["anime", "manga", "novel", "read online", "wibutime"],
};

export default async function HomePage() {
  // Fetch hero featured data from analytics trending API
  const seriesList = await getHeroFeatured(6);

  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Hero Section */}
      <HeroSection seriesList={seriesList} />
    </>
  );
}
