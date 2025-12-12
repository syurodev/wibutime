"use client";

import { useHomeData } from "@/features/home/components/home-data-provider";
import { TrendingSection } from "@/features/home/components/trending-section";

export default function TrendingSlot() {
  const { trending } = useHomeData();
  return <TrendingSection series={trending} />;
}
