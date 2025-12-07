import { getGenres } from "@/features/genre/api";
import { GenreHubSection } from "@/features/home/components/GenreHubSection";

export default async function GenreHubSlot() {
  // Fetch genres with limit 20, sorted by active readers
  const { data: genres } = await getGenres({
    limit: 12,
    sort_by: "series",
    sort_order: "desc",
    active_only: true,
  });

  return <GenreHubSection genres={genres || []} />;
}
