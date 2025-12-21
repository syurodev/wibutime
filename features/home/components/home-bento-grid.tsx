/**
 * Home Bento Grid Component
 * A responsive bento-style grid layout for home page sections
 * 6-column, 6-row grid layout
 */

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface HomeBentoGridProps {
  readonly eventSection: ReactNode;
  readonly topViewSection: ReactNode;
  readonly topOrganizationSection: ReactNode;
  readonly topCreatorSection: ReactNode;
  readonly topGenreSection: ReactNode;
  readonly continueSection: ReactNode;
}

interface BentoCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

function BentoCard({ children, className, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn(
        // Base card styles
        "relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl p-4",
        // Background
        "bg-card/80 backdrop-blur-sm",
        // Border
        "border-4 border-border/30",
        className
      )}
    >
      {/* Content wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export function HomeBentoGrid({
  eventSection,
  topViewSection,
  topOrganizationSection,
  topCreatorSection,
  topGenreSection,
  continueSection,
}: HomeBentoGridProps) {
  return (
    <section className="py-3 sm:py-4 lg:py-6 lg:min-h-[calc(100dvh-4rem)] lg:flex lg:flex-col">
      {/* 
        Bento Grid Layout (6x6):
        
        Desktop (lg+): 6 columns, 6 rows - fills viewport
        ┌────────┬────────┬────────┐
        │        │        │  Org   │ Row 1-3
        │ Event  │TopView ├────────┤
        │  2x4   │  2x4   │Creator │ Row 4-6
        ├────┬───┴────────┤  2x3   │
        │Gen │  Continue  │        │ Row 5-6
        │1x2 │    3x2     │        │
        └────┴────────────┴────────┘
        
        Tablet (md): 4 columns, auto rows
        Mobile: 1 column, stacked for readability
      */}
      <div
        className={cn(
          "grid gap-2 sm:gap-3 lg:gap-4",
          // Mobile: 1 column, stacked for better readability
          "grid-cols-1 auto-rows-[minmax(160px,auto)]",
          // Tablet: 4 columns
          "md:grid-cols-4 md:auto-rows-[minmax(160px,auto)]",
          // Desktop: 6 columns, 6 rows, fill height
          "lg:grid-cols-6 lg:grid-rows-6 lg:flex-1"
        )}
      >
        {/* Event Section - Featured (2 cols × 4 rows) */}
        <BentoCard
          className={cn(
            // Maintain aspect ratio for images
            "aspect-video p-0",
            // Mobile: full width
            "col-span-1",
            // Tablet: 2 cols
            "md:col-span-2 md:row-span-2 md:aspect-3/4",
            // Desktop: 2 cols × 4 rows, auto height based on grid
            "lg:col-span-2 lg:row-span-4 lg:aspect-auto"
          )}
          delay={0}
        >
          {eventSection}
        </BentoCard>

        {/* Top View Section - (2 cols × 4 rows) */}
        <BentoCard
          className={cn(
            "col-span-1",
            "md:col-span-2 md:row-span-2",
            "lg:col-span-2 lg:row-span-4"
          )}
          delay={0.05}
        >
          {topViewSection}
        </BentoCard>

        {/* Top Organization Section - (2 cols × 2 rows) */}
        <BentoCard
          className={cn(
            "col-span-1",
            "md:col-span-2 md:row-span-1",
            "lg:col-span-2 lg:row-span-2"
          )}
          delay={0.1}
        >
          {topOrganizationSection}
        </BentoCard>

        {/* Top Creator Section - (2 cols × 2 rows) */}
        <BentoCard
          className={cn(
            "col-span-1",
            "md:col-span-2 md:row-span-1",
            "lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:row-start-3"
          )}
          delay={0.15}
        >
          {topCreatorSection}
        </BentoCard>

        {/* Top Genre Section - (2 cols × 2 rows on desktop) */}
        <BentoCard
          className={cn(
            "col-span-1",
            // Tablet: 2 cols for better readability
            "md:col-span-2 md:row-span-1",
            // Desktop: 2 cols for better readability on iPad Pro
            "lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-5"
          )}
          delay={0.2}
        >
          {topGenreSection}
        </BentoCard>

        {/* Continue Section - Horizontal (4 cols × 2 rows on desktop) */}
        <BentoCard
          className={cn(
            "col-span-1",
            // Tablet: 2 cols (Genre takes 2, Continue takes 2)
            "md:col-span-2 md:row-span-1",
            // Desktop: 4 cols (Genre takes 2, Continue takes remaining 4)
            "lg:col-span-4 lg:row-span-2 lg:col-start-3 lg:row-start-5"
          )}
          delay={0.25}
        >
          {continueSection}
        </BentoCard>
      </div>
    </section>
  );
}
