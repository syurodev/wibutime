"use client";

import { useArtists } from "@/hooks/use-artists";
import { useAuthors } from "@/hooks/use-authors";
import { useDebounce } from "@/hooks/use-debounce";
import { useGenres } from "@/hooks/use-genres";
import {
  BookOpen,
  Filter,
  Globe,
  Palette,
  Search,
  SortAsc,
  SortDesc,
  Tag,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BrowseFilters() {
  const t = useTranslations("novel.browse.filters");
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const currentSearch = searchParams.get("key_search") || "";
  const currentGenreIds =
    searchParams.get("genre_ids")?.split(",").filter(Boolean) || [];
  const currentSortBy = searchParams.get("sort_by") || "last_chapter";
  const currentSortOrder = searchParams.get("sort_order") || "desc";
  const currentAuthorId = searchParams.get("author_id") || "all";
  const currentArtistId = searchParams.get("artist_id") || "all";
  const currentLanguage = searchParams.get("original_language") || "all";
  const currentStatus = searchParams.get("status") || "all";

  // Search State with Debounce
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Data Hooks
  const [genreSearch, setGenreSearch] = useState("");
  const {
    data: genres = [],
    loadMore: loadMoreGenres,
    hasMore: hasMoreGenres,
    isLoadingMore: isLoadingMoreGenres,
  } = useGenres(genreSearch);

  const [authorSearch, setAuthorSearch] = useState("");
  const { data: authors = [] } = useAuthors(authorSearch);

  const [artistSearch, setArtistSearch] = useState("");
  const { data: artists = [] } = useArtists(artistSearch);

  // Update URL on Search Change
  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateFilter("key_search", debouncedSearch);
    }
  }, [debouncedSearch, currentSearch]);

  // Handle URL Updates
  const updateFilter = (key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page on filter change
    params.set("page", "1");

    if (
      value === null ||
      value === "" ||
      value === "all" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  // Compute selected genres for MultiSelect
  const selectedGenres = currentGenreIds.map((id) => {
    const found = genres.find((g) => g.id === id);
    return found
      ? { label: found.name, value: found.id }
      : { label: t("loading"), value: id };
  });

  // Options
  const sortOptions = [
    { value: "views", label: t("options.sort.views") },
    { value: "last_chapter", label: t("options.sort.last_chapter") },
    { value: "created_at", label: t("options.sort.created_at") },
    { value: "rating", label: t("options.sort.rating") },
  ];

  const languageOptions = [
    { value: "all", label: t("options.language.all") },
    { value: "ja", label: t("options.language.ja") },
    { value: "ko", label: t("options.language.ko") },
    { value: "zh", label: t("options.language.zh") },
    { value: "vi", label: t("options.language.vi") },
    { value: "en", label: t("options.language.en") },
  ];

  const statusOptions = [
    { value: "all", label: t("options.status.all") },
    { value: "ongoing", label: t("options.status.ongoing") },
    { value: "completed", label: t("options.status.completed") },
    { value: "hiatus", label: t("options.status.hiatus") },
    { value: "dropped", label: t("options.status.dropped") },
  ];

  const hasActiveFilters =
    currentSearch ||
    currentGenreIds.length > 0 ||
    currentAuthorId !== "all" ||
    currentArtistId !== "all" ||
    currentLanguage !== "all" ||
    currentStatus !== "all";

  // Helper to remove a specific filter via badge
  const removeFilter = (key: string) => updateFilter(key, "all");

  return (
    <Card className="border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm mb-6">
      <CardContent className="p-0 sm:p-6 space-y-6">
        {/* Top Bar: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-9 h-10 border-muted-foreground/20 focus-visible:ring-primary/20 transition-all hover:border-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={currentSortBy}
              onValueChange={(val) => updateFilter("sort_by", val)}
            >
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={() =>
                      updateFilter(
                        "sort_order",
                        currentSortOrder === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    {currentSortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {currentSortOrder === "asc"
                      ? t("options.order.ascTooltip")
                      : t("options.order.descTooltip")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> {t("status")}
            </label>
            <Select
              value={currentStatus}
              onValueChange={(val) => updateFilter("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <Globe className="h-3 w-3" /> {t("language")}
            </label>
            <Select
              value={currentLanguage}
              onValueChange={(val) => updateFilter("original_language", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <User className="h-3 w-3" /> {t("author")}
            </label>
            <Select
              value={currentAuthorId}
              onValueChange={(val) => updateFilter("author_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectAuthor")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAuthors")}</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Artist */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <Palette className="h-3 w-3" /> {t("artist")}
            </label>
            <Select
              value={currentArtistId}
              onValueChange={(val) => updateFilter("artist_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectArtist")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allArtists")}</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Genres Filter - Full Width */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
            <Tag className="h-3 w-3" /> {t("genre")}
          </label>
          <MultiSelect
            options={genres.map((g) => ({ label: g.name, value: g.id }))}
            selected={selectedGenres}
            onChange={(vals) =>
              updateFilter(
                "genre_ids",
                vals.map((v) => v.value)
              )
            }
            placeholder={t("genrePlaceholder")}
            onSearch={setGenreSearch}
            onLoadMore={loadMoreGenres}
            hasMore={hasMoreGenres}
            loading={isLoadingMoreGenres}
          />
        </div>

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t mt-4 border-dashed">
            <span className="text-xs text-muted-foreground mr-2 font-medium flex items-center gap-1">
              <Filter className="h-3 w-3" /> {t("activeFilters")}
            </span>

            {currentStatus !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2.5">
                {statusOptions.find((o) => o.value === currentStatus)?.label}
                <button
                  onClick={() => removeFilter("status")}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}

            {currentLanguage !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2.5">
                {
                  languageOptions.find((o) => o.value === currentLanguage)
                    ?.label
                }
                <button
                  onClick={() => removeFilter("original_language")}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}

            {currentAuthorId !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2.5">
                {authors.find((a) => a.id === currentAuthorId)?.name ||
                  t("author")}
                <button
                  onClick={() => removeFilter("author_id")}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}

            {currentArtistId !== "all" && (
              <Badge variant="secondary" className="gap-1 pl-2.5">
                {artists.find((a) => a.id === currentArtistId)?.name ||
                  t("artist")}
                <button
                  onClick={() => removeFilter("artist_id")}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}

            {currentSearch && (
              <Badge variant="secondary" className="gap-1 pl-2.5">
                "{currentSearch}"
                <button
                  onClick={() => updateFilter("key_search", null)}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}

            {/* Note: Remove individual genres is handled by MultiSelect implicitly, 
                but we could show clear all filters button */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("?")}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs h-7 ml-auto"
            >
              {t("clearAll")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
