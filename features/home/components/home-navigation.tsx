/**
 * Home Navigation Setup (Client Component)
 * Sets up navigation items for the homepage
 *
 * Note: Home and Search are now default items that appear on ALL pages.
 * This component only needs to set page-specific items.
 */

"use client";

import { useNav } from "@/components/layout/nav/use-nav";
import { Library, User } from "lucide-react";
import { useEffect } from "react";

export function HomeNavigation() {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems([
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
