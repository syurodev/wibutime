"use client";

import { useSetNavigation } from "@/contexts/navigation-context";
import {
    createActionItem,
    createLinkItem,
    useCustomNav,
} from "@/hooks/use-nav-config";
import { useState } from "react";

export default function UserPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Mix of navigation links and action buttons
    const navItems = useCustomNav([
        // Link items
        createLinkItem({
            icon: "Home",
            href: "/",
            label: "Home",
        }),

        // Action items
        createActionItem({
            icon: isEditing ? "Save" : "Edit",
            label: isEditing ? "Save Changes" : "Edit Profile",
            onClick: () => {
                if (isEditing) {
                    console.log("Saving profile changes...");
                    // Simulate API save
                    setTimeout(() => {
                        setIsEditing(false);
                        console.log("Profile saved!");
                    }, 1000);
                } else {
                    setIsEditing(true);
                    console.log("Entering edit mode...");
                }
            },
            isActive: isEditing,
            variant: isEditing ? "success" : "default",
        }),

        ...(isEditing
            ? [
                  createActionItem({
                      icon: "X",
                      label: "Cancel",
                      onClick: () => {
                          setIsEditing(false);
                          console.log("Cancelled editing");
                      },
                      variant: "destructive",
                  }),
              ]
            : []),

        createActionItem({
            icon: "Share2",
            label: "Share Profile",
            onClick: () => {
                setShowShareMenu(!showShareMenu);
                console.log("Share menu toggled");
            },
            isActive: showShareMenu,
            variant: "default",
        }),

        createActionItem({
            icon: "MessageCircle",
            label: "Send Message",
            onClick: () => {
                console.log("Opening message dialog...");
            },
            variant: "default",
        }),
    ]);

    // Set navigation items for this page
    useSetNavigation(navItems);

    return (
        <>
            <div className="container mx-auto py-8 pb-20">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Profile Detail</h1>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    John Doe
                                </h2>
                                <p className="text-gray-600">@johndoe</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Bio
                                </label>
                                {isEditing ? (
                                    <textarea
                                        className="w-full p-2 border rounded-md"
                                        defaultValue="Software developer passionate about creating amazing user experiences."
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-700">
                                        Software developer passionate about
                                        creating amazing user experiences.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Location
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        defaultValue="San Francisco, CA"
                                    />
                                ) : (
                                    <p className="text-gray-700">
                                        San Francisco, CA
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    isEditing
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {isEditing ? "Edit Mode" : "View Mode"}
                            </span>
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    showShareMenu
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {showShareMenu
                                    ? "Share Menu Open"
                                    : "Share Menu Closed"}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            Navigation demonstrates: Mix of link (Home) and
                            action buttons (Edit, Share, Message). Notice how
                            Edit button changes to Save when in edit mode, and
                            Cancel button appears.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
