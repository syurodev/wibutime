"use client";

import type { GenreStats } from "@/features/genre/types";
import { GenreHubSection } from "@/features/home/components/GenreHubSection";
import { useHomeData } from "@/features/home/components/HomeDataProvider";

export default function GenreHubSlot() {
  const { genres } = useHomeData();

  // Map HomeGenre to GenreStats
  const genreStats: GenreStats[] = genres.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    description: g.description || "",
    series_count: g.novel_count,
    active_readers: g.active_readers,
    total_views: g.total_views,
  }));

  return <GenreHubSection genres={genreStats} />;
}
