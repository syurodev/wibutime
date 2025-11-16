"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Calendar, Film, SearchX, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SearchNavItem } from "./types";
import { useNav } from "./useNav";

interface NavSearchProps {
  readonly item: SearchNavItem;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
}

// Mock search data
const MOCK_RESULTS = [
  { id: 1, title: "Attack on Titan", type: "Anime", icon: Film },
  { id: 2, title: "One Piece", type: "Anime", icon: Film },
  { id: 3, title: "Demon Slayer", type: "Anime", icon: Film },
  { id: 4, title: "My Hero Academia", type: "Anime", icon: Film },
  { id: 5, title: "Jujutsu Kaisen", type: "Manga", icon: Book },
  { id: 6, title: "Chainsaw Man", type: "Manga", icon: Book },
  { id: 7, title: "Winter 2025", type: "Season", icon: Calendar },
  { id: 8, title: "Top Rated", type: "List", icon: TrendingUp },
  { id: 9, title: "Naruto", type: "Anime", icon: Film },
  { id: 10, title: "Death Note", type: "Anime", icon: Film },
  { id: 11, title: "Fullmetal Alchemist", type: "Anime", icon: Film },
  { id: 12, title: "Hunter x Hunter", type: "Anime", icon: Film },
  { id: 13, title: "Steins;Gate", type: "Anime", icon: Film },
  { id: 14, title: "Code Geass", type: "Anime", icon: Film },
  { id: 15, title: "Tokyo Ghoul", type: "Manga", icon: Book },
  { id: 16, title: "Vinland Saga", type: "Manga", icon: Book },
  { id: 17, title: "Berserk", type: "Manga", icon: Book },
  { id: 18, title: "One Punch Man", type: "Manga", icon: Book },
  { id: 19, title: "Mob Psycho 100", type: "Anime", icon: Film },
  { id: 20, title: "Spring 2025", type: "Season", icon: Calendar },
  { id: 21, title: "Summer 2025", type: "Season", icon: Calendar },
  { id: 22, title: "Fall 2025", type: "Season", icon: Calendar },
  { id: 23, title: "Most Popular", type: "List", icon: TrendingUp },
  { id: 24, title: "Trending Now", type: "List", icon: TrendingUp },
  { id: 25, title: "Sword Art Online", type: "Anime", icon: Film },
  { id: 26, title: "Re:Zero", type: "Anime", icon: Film },
  { id: 27, title: "Overlord", type: "Anime", icon: Film },
  { id: 28, title: "No Game No Life", type: "Anime", icon: Film },
  { id: 29, title: "Fairy Tail", type: "Manga", icon: Book },
  { id: 30, title: "Black Clover", type: "Manga", icon: Book },
  { id: 31, title: "Digimon Beatbreak", type: "Anime", icon: Film },
  {
    id: 32,
    title: "Chitose-kun wa Ramune Bin no Naka",
    type: "Anime",
    icon: Film,
  },
  {
    id: 33,
    title: "3-nen Z-gumi Ginpachi-sensei",
    type: "Anime",
    icon: Film,
  },
  { id: 34, title: "Bleach", type: "Anime", icon: Film },
  { id: 35, title: "Dragon Ball Z", type: "Anime", icon: Film },
  { id: 36, title: "Cowboy Bebop", type: "Anime", icon: Film },
  { id: 37, title: "Samurai Champloo", type: "Anime", icon: Film },
  { id: 38, title: "Neon Genesis Evangelion", type: "Anime", icon: Film },
  { id: 39, title: "Your Name", type: "Anime", icon: Film },
  { id: 40, title: "Spirited Away", type: "Anime", icon: Film },
  { id: 41, title: "Weathering with You", type: "Anime", icon: Film },
  { id: 42, title: "A Silent Voice", type: "Anime", icon: Film },
  { id: 43, title: "Your Lie in April", type: "Anime", icon: Film },
  { id: 44, title: "Anohana", type: "Anime", icon: Film },
  { id: 45, title: "Clannad", type: "Anime", icon: Film },
  { id: 46, title: "Angel Beats", type: "Anime", icon: Film },
  { id: 47, title: "Toradora", type: "Anime", icon: Film },
  { id: 48, title: "My Youth Romantic Comedy", type: "Anime", icon: Film },
  { id: 49, title: "Kaguya-sama Love is War", type: "Anime", icon: Film },
  { id: 50, title: "Horimiya", type: "Anime", icon: Film },
  { id: 51, title: "Fruits Basket", type: "Manga", icon: Book },
  { id: 52, title: "Slam Dunk", type: "Manga", icon: Book },
  { id: 53, title: "Haikyu!!", type: "Manga", icon: Book },
  { id: 54, title: "Blue Lock", type: "Manga", icon: Book },
  { id: 55, title: "The Promised Neverland", type: "Manga", icon: Book },
  { id: 56, title: "Dr. Stone", type: "Manga", icon: Book },
  { id: 57, title: "Spy x Family", type: "Manga", icon: Book },
  { id: 58, title: "Kaiju No. 8", type: "Manga", icon: Book },
  { id: 59, title: "Dandadan", type: "Manga", icon: Book },
  { id: 60, title: "Sakamoto Days", type: "Manga", icon: Book },
];

/**
 * Nav Search Component
 *
 * Displays a full-width search input with close button and search results.
 * Results appear above the input within the nav container.
 * Only used when search mode is active.
 * NavSearchButton is used for the nav button that triggers search mode.
 */
export function NavSearch({ item, onFocus, onBlur }: NavSearchProps) {
  const { toggleSearch } = useNav();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce query and simulate loading
  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebouncedQuery("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsLoading(false);
    }, 500); // 500ms delay to simulate API call

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Filter results based on search query
   */
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const lowerQuery = debouncedQuery.toLowerCase();
    return MOCK_RESULTS.filter(
      (result) =>
        result.title.toLowerCase().includes(lowerQuery) ||
        result.type.toLowerCase().includes(lowerQuery)
    ).slice(0, 20); // Limit to 20 results for scroll demo
  }, [debouncedQuery]);

  /**
   * Handle search input changes
   * Updates local state and calls the onSearch callback if provided
   */
  const handleSearch = (value: string) => {
    setQuery(value);
    if (item.onSearch) {
      item.onSearch(value);
    }
  };

  return (
    <div className="flex flex-col-reverse gap-3 w-full">
      {/* Search input and close button - always visible at bottom (flex-col-reverse makes it appear at bottom) */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={item.placeholder || "Search..."}
          className="flex-1 h-9 border-0 shadow-none bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          autoFocus // Auto-focus input when search mode opens
        />
        {/* Close button to exit search mode */}
        <button
          onClick={toggleSearch}
          className="p-2 hover:opacity-70 rounded-lg shrink-0 transition-opacity"
          aria-label="Close search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search results - scrollable container above input */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center py-8"
          >
            <Spinner className="w-6 h-6" />
          </motion.div>
        )}

        {!isLoading && filteredResults.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: "400px" }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col gap-1 pr-2">
                {filteredResults.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.15,
                        delay: index * 0.03, // Stagger effect
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:opacity-70 transition-opacity text-left"
                      onClick={() => {
                        console.log("Selected:", result.title);
                        // In real app, navigate or perform action
                      }}
                    >
                      <Icon className="w-4 h-4 opacity-60 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {result.title}
                        </p>
                        <p className="text-xs opacity-60">{result.type}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {!isLoading && debouncedQuery && filteredResults.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center py-8 gap-2"
          >
            <SearchX className="w-8 h-8 opacity-40" />
            <p className="text-sm opacity-60">No results found</p>
            <p className="text-xs opacity-40">Try a different search term</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
