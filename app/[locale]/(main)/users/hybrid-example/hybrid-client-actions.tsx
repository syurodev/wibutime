"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { createActionItem } from "@/hooks/use-nav-config";
import { useEffect, useState } from "react";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    location: string;
    joinDate: string;
    posts: number;
    followers: number;
    following: number;
}

interface HybridClientActionsProps {
    userProfile: UserProfile;
}

export default function HybridClientActions({
    userProfile,
}: HybridClientActionsProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { navItems, updateNavItems } = useNavigation();

    // Add dynamic action items to existing navigation
    useEffect(() => {
        const actionItems = [
            createActionItem({
                icon: isFollowing ? "UserMinus" : "UserPlus",
                label: isFollowing ? "Unfollow" : "Follow",
                onClick: async () => {
                    setIsLoading(true);
                    // Simulate API call
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    setIsFollowing(!isFollowing);
                    setIsLoading(false);
                    console.log(
                        isFollowing ? "Unfollowed user" : "Followed user",
                    );
                },
                isActive: isFollowing,
                variant: isFollowing ? "destructive" : "success",
            }),
            createActionItem({
                icon: isFavorite ? "HeartOff" : "Heart",
                label: isFavorite ? "Remove Favorite" : "Add Favorite",
                onClick: async () => {
                    setIsLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    setIsFavorite(!isFavorite);
                    setIsLoading(false);
                    console.log(
                        isFavorite
                            ? "Removed from favorites"
                            : "Added to favorites",
                    );
                },
                isActive: isFavorite,
                variant: "default",
            }),
            createActionItem({
                icon: "MessageCircle",
                label: "Send Message",
                onClick: () => {
                    console.log(
                        `Opening message dialog for ${userProfile.name}`,
                    );
                },
                variant: "default",
            }),
            createActionItem({
                icon: "Share2",
                label: "Share Profile",
                onClick: () => {
                    const url = `${window.location.origin}/users/${userProfile.id}`;
                    navigator.clipboard.writeText(url);
                    console.log("Profile URL copied to clipboard");
                },
                variant: "default",
            }),
            createActionItem({
                icon: "Edit",
                label: "Edit Profile",
                onClick: () => {
                    console.log("Redirecting to edit profile...");
                },
                variant: "default",
            }),
        ];

        // Update navigation with base items + action items
        updateNavItems((currentItems) => {
            // Keep only non-action items and add new action items
            const baseItems = currentItems.filter(
                (item) => item.type === "link",
            );
            return [...baseItems, ...actionItems];
        });
    }, [isFollowing, isFavorite, updateNavItems, userProfile]);

    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
                Interactive Actions (Client Component)
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded text-sm ${
                            isFollowing
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {isFollowing ? "✅ Following" : "➕ Not Following"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded text-sm ${
                            isFavorite
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {isFavorite ? "❤️ Favorite" : "🤍 Not Favorite"}
                    </span>
                </div>
            </div>

            {isLoading && (
                <div className="text-sm text-blue-600 mb-2">
                    🔄 Processing action...
                </div>
            )}

            <div className="text-sm text-blue-700">
                <p className="mb-2">
                    <strong>Current State:</strong> This client component
                    manages interactive state and dynamically updates the
                    navigation bar with action buttons.
                </p>
                <p>
                    Use the navigation buttons below to see real-time state
                    changes and API simulations. Notice how the navigation
                    updates based on current state (following/favorite status).
                </p>
            </div>
        </div>
    );
}
