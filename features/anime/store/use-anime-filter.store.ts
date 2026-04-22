import { create } from "zustand"

interface AnimeFilterState {
  genre: string | null
  year: number | null
  search: string
  setGenre: (genre: string | null) => void
  setYear: (year: number | null) => void
  setSearch: (search: string) => void
  reset: () => void
}

export const useAnimeFilterStore = create<AnimeFilterState>((set) => ({
  genre: null,
  year: null,
  search: "",
  setGenre: (genre) => set({ genre }),
  setYear: (year) => set({ year }),
  setSearch: (search) => set({ search }),
  reset: () => set({ genre: null, year: null, search: "" }),
}))
