/**
 * Genre Tag Component
 * Displays genre/category tags with optional link
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface GenreTagProps {
  /**
   * Genre name
   */
  genre: string;

  /**
   * Link to genre filter page
   */
  href?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Click handler (if not using href)
   */
  onClick?: () => void;
}

export function GenreTag({ genre, href, className, onClick }: GenreTagProps) {
  const badgeContent = (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer transition-colors hover:bg-secondary/80",
        className
      )}
    >
      {genre}
    </Badge>
  );

  if (href) {
    return <Link href={href}>{badgeContent}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick}>{badgeContent}</button>;
  }

  return badgeContent;
}
