"use client";

import { useHomeData } from "@/features/home/components/home-data-provider";
import { TopCreatorsSection } from "@/features/home/components/top-creators-section";

export default function CommunitySlot() {
  const { creators } = useHomeData();
  return <TopCreatorsSection creators={creators} />;
}
