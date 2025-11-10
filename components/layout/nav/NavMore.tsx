/**
 * NavMore Component
 * Displays overflow navigation items in a drawer/sheet
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import type { NavItem } from "./types";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface NavMoreProps {
  /**
   * Whether the drawer is open
   */
  open: boolean;

  /**
   * Callback when drawer should close
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Navigation items to display
   */
  items: NavItem[];

  /**
   * Set of item IDs currently in loading state
   */
  loadingItems: Set<string>;

  /**
   * Callback to set item loading state
   */
  setItemLoading: (itemId: string, loading: boolean) => void;
}

export function NavMore({
  open,
  onOpenChange,
  items,
  loadingItems,
  setItemLoading,
}: NavMoreProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleItemClick = async (item: NavItem) => {
    switch (item.type) {
      case "link":
        router.push(item.href);
        onOpenChange(false);
        break;

      case "action":
        setItemLoading(item.id, true);
        try {
          await item.onClick();
          if (item.successMessage) {
            toast.success(item.successMessage);
          }
          onOpenChange(false);
        } catch (error) {
          if (item.errorMessage) {
            toast.error(item.errorMessage);
          }
        } finally {
          setItemLoading(item.id, false);
        }
        break;

      case "trigger":
        item.onClick();
        onOpenChange(false);
        break;

      case "search":
        // Search handled separately
        break;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="relative">
          <DrawerTitle>More Options</DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Items List */}
        <div className="space-y-1 p-4 pb-8">
          {items.map((item) => {
            const isLoading = loadingItems.has(item.id);

            // Search item special handling
            if (item.type === "search") {
              return (
                <div key={item.id} className="space-y-2">
                  <label className="flex items-center gap-3 px-4 py-2 text-sm font-medium">
                    {item.icon}
                    <span>{item.label}</span>
                  </label>
                  <input
                    type="search"
                    placeholder={item.placeholder || "Search..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      item.onSearch?.(e.target.value);
                    }}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              );
            }

            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 px-4 py-6 text-base"
                onClick={() => handleItemClick(item)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
