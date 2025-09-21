"use client";

import { useSetNavigation } from "@/contexts/navigation-context";
import {
    createActionItem,
    useCustomNav,
    useNavConfig,
} from "@/hooks/use-nav-config";
import { useState } from "react";

export default function UsersPage() {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const baseNavItems = useNavConfig("users");

    // Create action items with dynamic states
    const actionItems = [
        createActionItem({
            icon: isFollowing ? "UserMinus" : "UserPlus",
            label: isFollowing ? "Unfollow" : "Follow",
            onClick: () => {
                setIsFollowLoading(true);
                console.log(
                    isFollowing ? "Unfollowing user..." : "Following user...",
                );
                // Simulate API call with a delay
                setTimeout(() => {
                    setIsFollowing((prev) => !prev);
                    setIsFollowLoading(false);
                }, 1500);
            },
            isActive: isFollowing,
            variant: isFollowing ? "destructive" : "success",
            isLoading: isFollowLoading,
        }),
        createActionItem({
            icon: isFavorite ? "HeartOff" : "Heart",
            label: isFavorite ? "Remove Favorite" : "Add Favorite",
            onClick: () => {
                setIsFavoriteLoading(true);
                console.log(
                    isFavorite
                        ? "Removing from favorites..."
                        : "Adding to favorites...",
                );
                // Simulate API call with a delay
                setTimeout(() => {
                    setIsFavorite((prev) => !prev);
                    setIsFavoriteLoading(false);
                }, 1500);
            },
            isActive: isFavorite,
            variant: "default",
            isLoading: isFavoriteLoading,
        }),
        createActionItem({
            icon: "Star",
            label: "Rate User",
            onClick: () => {
                // Simulate rating action
                console.log("Opening rating dialog...");
            },
            variant: "default",
        }),
    ];

    const navItems = useCustomNav([...baseNavItems, ...actionItems]);

    // Set navigation items for this page
    useSetNavigation(navItems);

    return (
        <>
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">John Doe</h2>
                    <p className="text-gray-600 mb-4">Software Developer</p>

                    <div className="flex gap-2 mb-4">
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                isFollowing
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {isFollowing ? "Following" : "Not Following"}
                        </span>
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                isFavorite
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {isFavorite ? "Favorite" : "Not Favorite"}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Use the navigation buttons below to interact with this
                        user. Notice how the icons and colors change based on
                        the current state.
                    </p>
                </div>
            </div>
        </>
    );
}
