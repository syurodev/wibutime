/**
 * Nav Account Button Component
 * Dynamic account/menu button (part of default nav items)
 */

"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useNav } from "./useNav";
import { NavTriggerItem } from "./NavTriggerItem";

interface NavAccountButtonProps {
  /**
   * Index for stagger animation
   */
  readonly index: number;

  /**
   * Number of overflow items (for badge)
   */
  readonly overflowCount: number;
}

export function NavAccountButton({ index, overflowCount }: NavAccountButtonProps) {
  const { user, isLoggedIn } = useAuth();
  const { toggleAccountMenu } = useNav();

  return (
    <NavTriggerItem
      key="account-button"
      item={{
        id: "default-account",
        type: "trigger",
        icon:
          isLoggedIn && user ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="text-xs">
                {user.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <MoreHorizontal className="h-5 w-5" />
          ),
        label: isLoggedIn ? user?.display_name || "Account" : "Menu",
        badge: !isLoggedIn
          ? "!"
          : overflowCount > 0
          ? overflowCount
          : undefined,
        onClick: toggleAccountMenu,
      }}
      index={index}
    />
  );
}
