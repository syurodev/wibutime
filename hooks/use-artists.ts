import { ArtistService } from "@/lib/api/services/artist/artist.service";
import { useEffect, useState } from "react";

export interface Artist {
  id: string;
  name: string;
}

export function useArtists(search?: string) {
  const [data, setData] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const res = await ArtistService.getSelection(search, page);
        const newData = res?.items || [];

        if (page === 1) {
          setData(newData);
        } else {
          setData((prev) => [...prev, ...newData]);
        }

        const totalPages = res?.meta?.total_pages || 1;
        setHasMore(page < totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    const timeoutId = setTimeout(
      () => {
        fetchData();
      },
      search && page === 1 ? 300 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const loadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { data, isLoading, error, loadMore, hasMore, isLoadingMore };
}
