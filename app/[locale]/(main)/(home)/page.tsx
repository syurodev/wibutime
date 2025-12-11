/**
 * Homepage - WibuTime
 * Hero section only, other sections are parallel routes
 */

import { HeroSectionWrapper } from "@/features/home/components/hero-section-wrapper";
import { HomeNavigation } from "@/features/home/components/home-navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WibuTime - Anime, Manga & Novel Platform",
  description:
    "Discover and read the latest anime, manga, and novels. Join thousands of readers and creators on WibuTime.",
  keywords: ["anime", "manga", "novel", "read online", "wibutime"],
};

export default function HomePage() {
  return (
    <>
      {/* Navigation Setup (Client Component) */}
      <HomeNavigation />

      {/* Hero Section - uses useHomeData hook */}
      <HeroSectionWrapper />
    </>
  );
}
