"use client";

import { useEffect } from "react";
import { useNav } from "@/components/layout/nav/useNav";
import { Home, Search, Library, User } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function HomePage() {
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
        placeholder: "Search anything...",
        onSearch: (query) => console.log("Searching:", query),
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to WibuTime</h1>
      <p className="text-gray-600 mb-6">
        This page demonstrates basic navigation with Link items and Search.
      </p>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Try the Navigation Bar:</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Click on different nav items to navigate between pages</li>
            <li>Click the Search icon to expand the search bar</li>
            <li>Notice the active state on the current page</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/library"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-2">Library Page →</h3>
            <p className="text-sm text-gray-600">
              See action items with loading states
            </p>
          </Link>

          <Link
            href="/profile"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-2">Profile Page →</h3>
            <p className="text-sm text-gray-600">
              See trigger items that open modals
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
