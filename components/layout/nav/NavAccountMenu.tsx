/**
 * Nav Account Menu Content Component
 * Content for user account, overflow items, and settings
 * Renders inline in nav (not dropdown)
 */

"use client";

import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./types";
import { UserSection } from "./UserSection";
import { ThemeToggleCompact } from "./ThemeToggleCompact";
import { ReduceBlurToggle } from "./ReduceBlurToggle";

export interface NavAccountMenuContentProps {
  /**
   * Callback when menu should close
   */
  readonly onClose: () => void;

  /**
   * Overflow navigation items to display
   */
  readonly items: NavItem[];

  /**
   * Set of item IDs currently in loading state
   */
  readonly loadingItems: Set<string>;

  /**
   * Callback to set item loading state
   */
  readonly setItemLoading: (itemId: string, loading: boolean) => void;
}

export function NavAccountMenuContent({
  onClose,
  items,
  loadingItems,
  setItemLoading,
}: NavAccountMenuContentProps) {
  const router = useRouter();

  const handleItemClick = async (item: NavItem) => {
    switch (item.type) {
      case "link":
        router.push(item.href);
        onClose();
        break;

      case "action":
        setItemLoading(item.id, true);
        try {
          await item.onClick();
          if (item.successMessage) {
            toast.success(item.successMessage);
          }
          onClose();
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
        onClose();
        break;

      case "search":
        // Search handled separately
        break;
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Close Button (Mobile-friendly) */}
      <div className="flex justify-end px-2 pt-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User Section */}
      <UserSection onActionClick={onClose} />

      {/* Overflow Items (if any) */}
      {items.length > 0 && (
        <>
          <div className="border-t border-border" />
          <div className="space-y-1 px-2">
            {items.map((item) => {
              const isLoading = loadingItems.has(item.id);

              // Skip search items
              if (item.type === "search") {
                return null;
              }

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start h-9 px-2"
                  onClick={() => handleItemClick(item)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <span className="mr-2 flex h-4 w-4 items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </>
      )}

      {/* Theme Toggle */}
      <div className="border-t border-border" />
      <ThemeToggleCompact />

      {/* Reduce Blur Toggle */}
      <ReduceBlurToggle />
    </div>
  );
}
