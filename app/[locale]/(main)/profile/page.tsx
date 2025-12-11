"use client";

import { useNav } from "@/components/layout/nav/use-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Edit, Home, Settings, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { setNavItems } = useNav();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
        id: "settings",
        type: "trigger",
        icon: <Settings className="w-5 h-5" />,
        label: "Settings",
        onClick: () => setIsSettingsOpen(true),
      },
      {
        id: "share",
        type: "trigger",
        icon: <Share2 className="w-5 h-5" />,
        label: "Share",
        onClick: () => setIsShareOpen(true),
      },
      {
        id: "edit",
        type: "trigger",
        icon: <Edit className="w-5 h-5" />,
        label: "Edit",
        onClick: () => setIsEditOpen(true),
        badge: "!",
      },
    ]);
  }, [setNavItems]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates Trigger items that open modals and sheets.
        </p>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
            <h2 className="font-semibold mb-2">Trigger Items Demo:</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <strong>Settings:</strong> Opens a Dialog modal
              </li>
              <li>
                <strong>Share:</strong> Opens a Sheet (side panel)
              </li>
              <li>
                <strong>Edit:</strong> Opens another Dialog with badge indicator
              </li>
              <li>All trigger actions are synchronous (no loading state)</li>
              <li>Perfect for UI interactions like modals, drawers, etc.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-6 border rounded-lg hover:border-primary transition-colors text-left"
            >
              <Settings className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Open Settings</h3>
              <p className="text-sm text-gray-600">Click to open dialog</p>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="p-6 border rounded-lg hover:border-primary transition-colors text-left"
            >
              <Share2 className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Share Profile</h3>
              <p className="text-sm text-gray-600">Click to open sheet</p>
            </button>

            <button
              onClick={() => setIsEditOpen(true)}
              className="p-6 border rounded-lg hover:border-primary transition-colors text-left"
            >
              <Edit className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">Edit Profile</h3>
              <p className="text-sm text-gray-600">Click to edit</p>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Account Settings</h4>
              <p className="text-sm text-gray-600">
                This dialog was triggered by the Settings nav item.
              </p>
            </div>
            <Button onClick={() => setIsSettingsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Sheet */}
      <Sheet open={isShareOpen} onOpenChange={setIsShareOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Share Profile</SheetTitle>
            <SheetDescription>Share your profile with others</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              This sheet was triggered by the Share nav item.
            </p>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                Copy Link
              </Button>
              <Button className="w-full" variant="outline">
                Share via Email
              </Button>
              <Button className="w-full" variant="outline">
                Share on Social
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              This dialog was triggered by the Edit nav item (with badge
              indicator).
            </p>
            <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
