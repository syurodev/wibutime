"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/components/layout/nav/useNav";
import { Home, Heart, Bookmark, Bell, User, Settings, Search, Share2 } from "lucide-react";

export default function LibraryPage() {
  const { setNavItems } = useNav();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
        id: "follow",
        type: "action",
        icon: <Heart className="w-5 h-5" />,
        label: isFollowing ? "Following" : "Follow",
        loadingText: "Loading...",
        successMessage: isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully",
        errorMessage: "Failed to follow",
        onClick: async () => {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Simulate random error (20% chance)
          if (Math.random() < 0.2) {
            throw new Error("Network error");
          }

          setIsFollowing((prev) => !prev);
        },
        badge: isFollowing ? "✓" : undefined,
      },
      {
        id: "save",
        type: "action",
        icon: <Bookmark className="w-5 h-5" />,
        label: "Save",
        loadingText: "Saving...",
        successMessage: "Saved to library",
        errorMessage: "Failed to save",
        onClick: async () => {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsSaved(true);
        },
      },
      {
        id: "notify",
        type: "action",
        icon: <Bell className="w-5 h-5" />,
        label: "Notify",
        loadingText: "Sending...",
        successMessage: "Notification sent!",
        onClick: async () => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        },
        badge: 3,
      },
      {
        id: "profile",
        type: "link",
        href: "/profile",
        icon: <User className="w-5 h-5" />,
        label: "Profile",
      },
      {
        id: "settings",
        type: "trigger",
        icon: <Settings className="w-5 h-5" />,
        label: "Settings",
        onClick: () => {
          alert("Settings clicked! In real app, this would open a modal/sheet.");
        },
      },
      {
        id: "share",
        type: "action",
        icon: <Share2 className="w-5 h-5" />,
        label: "Share",
        loadingText: "Sharing...",
        successMessage: "Shared successfully!",
        onClick: async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
        },
      },
      {
        id: "search",
        type: "search",
        icon: <Search className="w-5 h-5" />,
        label: "Search",
        placeholder: "Search library...",
        onSearch: (query) => {
          console.log("Searching for:", query);
        },
      },
    ]);
  }, [setNavItems, isFollowing]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold mb-4">Library</h1>
      <p className="text-gray-600 mb-6">
        This page demonstrates Action items with async operations.
      </p>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
          <h2 className="font-semibold mb-2">Action Items Demo:</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>
              <strong>Follow Button:</strong> Async action with loading state.
              Has 20% chance to fail (demonstrates error handling)
            </li>
            <li>
              <strong>Save Button:</strong> Simulates saving to library
            </li>
            <li>
              <strong>Notify Button:</strong> Shows badge with count (3)
            </li>
            <li>Items are disabled during loading</li>
            <li>Success/error messages appear as toast notifications</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-4">Status:</h3>
          <div className="space-y-2 text-sm">
            <p>
              Following:{" "}
              <span className={isFollowing ? "text-green-600" : "text-gray-400"}>
                {isFollowing ? "Yes ✓" : "No"}
              </span>
            </p>
            <p>
              Saved to Library:{" "}
              <span className={isSaved ? "text-green-600" : "text-gray-400"}>
                {isSaved ? "Yes ✓" : "No"}
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Tip:</strong> Try clicking the Follow button multiple times
            to see the loading state and error handling in action!
          </p>
        </div>
      </div>
    </div>
  );
}
