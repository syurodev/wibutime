/**
 * Section Wrapper Component
 * Container for homepage sections with consistent spacing and layout
 */

import { cn } from "@/lib/utils";
import { SectionHeader, type SectionHeaderProps } from "./section-header";

export interface SectionWrapperProps extends SectionHeaderProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly id?: string;
}

export function SectionWrapper({
  children,
  className,
  contentClassName,
  id,
  ...headerProps
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("space-y-6 py-8 md:py-12", className)}>
      {/* Header */}
      <SectionHeader {...headerProps} />

      {/* Content */}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}
