import { getTrendingFeatured } from "@/features/content/queries";
import { TrendingSection } from "@/features/home/components/TrendingSection";

export default async function TrendingSlot() {
  const series = await getTrendingFeatured(20);

  return <TrendingSection series={series} />;
}
