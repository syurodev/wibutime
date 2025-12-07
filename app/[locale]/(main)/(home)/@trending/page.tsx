"use client";

import { useHomeData } from "@/features/home/components/HomeDataProvider";
import { TrendingSection } from "@/features/home/components/TrendingSection";

export default function TrendingSlot() {
  const { trending } = useHomeData();
  return <TrendingSection series={trending} />;
}
