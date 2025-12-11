/**
 * Nav Account Button Component
 * Dynamic account/menu button (part of default nav items)
 */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils/get-initials";
import { MoreHorizontal } from "lucide-react";
import { NavTriggerItem } from "./nav-trigger-item";
import { useNav } from "./use-nav";

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

export function NavAccountButton({
  index,
  overflowCount,
}: NavAccountButtonProps) {
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
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <MoreHorizontal className="h-5 w-5" />
          ),
        label: isLoggedIn ? user?.name || "Account" : "Menu",
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
