import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { queryKeys } from "@/queries/keys"

interface Anime {
  id: number
  title: string
  coverImage: string
  episodes: number
}

interface AnimeListResponse {
  data: Anime[]
  total: number
}

export function useAnimeList(page = 1) {
  return useQuery({
    queryKey: queryKeys.anime.list({ page }),
    queryFn: () => api.get<AnimeListResponse>(`/api/anime?page=${page}`),
  })
}

export function useAnimeDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.anime.detail(id),
    queryFn: () => api.get<Anime>(`/api/anime/${id}`),
    enabled: !!id,
  })
}
