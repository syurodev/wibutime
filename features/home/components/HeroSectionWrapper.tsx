"use client";

import { HeroSection } from "./HeroSection";
import { useHomeData } from "./HomeDataProvider";

/**
 * Wrapper component that uses useHomeData hook
 * Must be client component to use the hook
 */
export function HeroSectionWrapper() {
  const { hero } = useHomeData();
  return <HeroSection seriesList={hero} />;
}
