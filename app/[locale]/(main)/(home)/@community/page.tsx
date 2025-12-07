"use client";

import { useHomeData } from "@/features/home/components/HomeDataProvider";
import { TopCreatorsSection } from "@/features/home/components/TopCreatorsSection";

export default function CommunitySlot() {
  const { creators } = useHomeData();
  return <TopCreatorsSection creators={creators} />;
}
