/**
 * Home Navigation Setup (Client Component)
 * Sets up navigation items for the homepage
 */

"use client";

import { useEffect } from "react";
import { useNav } from "@/components/layout/nav/useNav";
import { Home, Search, Library, User } from "lucide-react";

export function HomeNavigation() {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        label: "Home",
      },
      {
        id: "search",
        type: "search",
        icon: <Search className="w-5 h-5" />,
        label: "Search",
        placeholder: "Search anime, manga, novel...",
        onSearch: (query) => {
          // TODO: Implement search functionality
          console.log("Searching:", query);
        },
      },
      {
        id: "library",
        type: "link",
        href: "/library",
        icon: <Library className="w-5 h-5" />,
        label: "Library",
      },
      {
        id: "profile",
        type: "link",
        href: "/profile",
        icon: <User className="w-5 h-5" />,
        label: "Profile",
      },
    ]);
  }, [setNavItems]);

  return null; // This component doesn't render anything
}
