/**
 * Default Navigation Items Configuration
 *
 * Defines navigation items that appear on ALL pages by default.
 * - defaultItemsStart: Items that appear at the START of navigation (e.g., Home)
 * - defaultItemsEnd: Items that appear at the END of navigation (e.g., Search)
 *
 * Page-specific items will be inserted BETWEEN start and end defaults.
 * Render order: [...start, ...pageItems, ...end]
 */

import { Home, Search } from "lucide-react";
import type { LinkNavItem, SearchNavItem } from "./types";

/**
 * Default items that appear at the START of navigation
 * These will always be rendered FIRST
 */
export const defaultItemsStart: LinkNavItem[] = [
  {
    id: "default-home",
    type: "link",
    href: "/",
    icon: <Home className="h-5 w-5" />,
    label: "Home",
  },
];

/**
 * Default items that appear at the END of navigation
 * These will always be rendered LAST
 */
export const defaultItemsEnd: SearchNavItem[] = [
  {
    id: "default-search",
    type: "search",
    icon: <Search className="h-5 w-5" />,
    label: "Search",
    placeholder: "Search WibuTime...",
    // Global search handler
    onSearch: (query: string) => {
      // TODO: Implement global search functionality
      console.log("Global search:", query);
    },
  },
];

/**
 * IDs of all default items
 * Used to filter out any page-specific items that try to use these IDs
 */
export const DEFAULT_ITEM_IDS = new Set([
  ...defaultItemsStart.map((item) => item.id),
  ...defaultItemsEnd.map((item) => item.id),
  "default-account", // Account/Menu button (rendered separately due to dynamic nature)
]);
