"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquarePlus } from "lucide-react";
import { useNav } from "./use-nav";

export interface NavCommentTriggerProps {
  /**
   * Button variant
   * @default "default"
   */
  variant?: "default" | "outline" | "ghost" | "secondary";

  /**
   * Button size
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";

  /**
   * Show tooltip
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Tooltip text
   * @default "Write a comment"
   */
  tooltipText?: string;

  /**
   * Button text (not shown if size="icon")
   * @default "Comment"
   */
  buttonText?: string;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Nav Comment Trigger Button
 *
 * A button component that triggers the comment editor in the navigation bar.
 * Can be placed anywhere in the app - typically in the header or as a floating action button.
 *
 * @example
 * // As icon button
 * <NavCommentTrigger size="icon" variant="outline" />
 *
 * // With text
 * <NavCommentTrigger buttonText="Add Comment" />
 *
 * // Custom styling
 * <NavCommentTrigger className="fixed bottom-20 right-6" size="lg" />
 */
export function NavCommentTrigger({
  variant = "default",
  size = "default",
  showTooltip = true,
  tooltipText = "Write a comment",
  buttonText = "Comment",
  className,
}: NavCommentTriggerProps) {
  const { toggleComment, commentMode } = useNav();

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={toggleComment}
      className={className}
      aria-label={tooltipText}
      data-active={commentMode}
    >
      <MessageSquarePlus className={size === "icon" ? "" : "mr-2"} />
      {size !== "icon" && buttonText}
    </Button>
  );

  if (showTooltip && size === "icon") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
