export const queryKeys = {
  anime: {
    all: ["anime"] as const,
    lists: () => [...queryKeys.anime.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.anime.lists(), filters] as const,
    details: () => [...queryKeys.anime.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.anime.details(), id] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
} as const
