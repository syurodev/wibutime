/**
 * Section Header Component
 * Displays section title, subtitle, and optional action
 */

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface SectionHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly href?: string;
  readonly linkText?: string;
  readonly action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "See All",
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Title and subtitle */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {action ? (
          action
        ) : href ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={href}>
              {linkText}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
