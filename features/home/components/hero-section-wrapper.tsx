"use client";

import { HeroSection } from "./hero-section";
import { useHomeData } from "./home-data-provider";

/**
 * Wrapper component that uses useHomeData hook
 * Must be client component to use the hook
 */
export function HeroSectionWrapper() {
  const { hero } = useHomeData();
  return <HeroSection seriesList={hero} />;
}
