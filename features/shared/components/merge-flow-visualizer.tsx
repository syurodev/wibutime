"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface MergeFlowVisualizerProps {
  sources: { label: string; value: string }[];
  target: { label: string; value: string } | null;
  className?: string;
}

export function MergeFlowVisualizer({
  sources,
  target,
  className,
}: MergeFlowVisualizerProps) {
  const t = useTranslations("common");

  // Calculate the vertical span based on item count ratio
  const sourceCount = Math.max(sources.length, 1);
  const isSingleSource = sourceCount === 1;

  // Calculate relative height for the right side (target)
  // If we assume each item is roughly same height, target (1 item) takes 1/sourceCount of total height.
  // We add some buffer so it's not too squeezed.
  // Ensure minimum height (e.g. 10px half-height -> 20px total) to accommodate rounded corners (radius 4)
  // For single source, we want a thinner pipe (e.g. 60px total height => 30 half-height)
  // This ensures the badge fits comfortably inside without spilling out
  const targetHalfHeight = isSingleSource
    ? 30
    : Math.max(10, Math.min(40, (1 / sourceCount) * 50));

  const topY = 50 - targetHalfHeight;
  const bottomY = 50 + targetHalfHeight;

  // For single source, match the target height (symmetric pipe)
  // For multiple sources, use full height (funnel)
  const sourceTopY = isSingleSource ? topY : 0;
  const sourceBottomY = isSingleSource ? bottomY : 100;

  return (
    <div
      className={cn(
        "relative w-full min-h-[140px] isolate flex flex-col justify-center",
        className
      )}
    >
      {/* SVG Background Layer */}
      <div className="absolute inset-0 -z-10 px-4">
        <svg
          className="w-full h-full drop-shadow-sm"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id="merge-flow-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#fea5a5" stopOpacity="0.2" />{" "}
              {/* Red-300 */}
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />{" "}
              {/* Blue-300 */}
            </linearGradient>
            <linearGradient id="merge-flow-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${
              sourceTopY + 4
            } Q 0 ${sourceTopY} 4 ${sourceTopY} C 40 ${sourceTopY} 60 ${topY} 96 ${topY} Q 100 ${topY} 100 ${
              topY + 4
            } L 100 ${
              bottomY - 4
            } Q 100 ${bottomY} 96 ${bottomY} C 60 ${bottomY} 40 ${sourceBottomY} 4 ${sourceBottomY} Q 0 ${sourceBottomY} 0 ${
              sourceBottomY - 4
            } Z`}
            fill="url(#merge-flow-gradient)"
            stroke="url(#merge-flow-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="flex items-center justify-between w-full py-6 px-8 gap-12">
        {/* Left: Sources */}
        <div className="flex flex-col justify-center gap-3 flex-1 w-1/3">
          {sources.map((s) => (
            <Badge
              key={s.value}
              className="bg-background/60 backdrop-blur-md p-2"
              title={s.label}
              variant={"outline"}
            >
              {s.label}
            </Badge>
          ))}
        </div>

        {/* Center Arrow */}
        <div className="text-muted-foreground/30">
          <ArrowRight className="w-8 h-8" />
        </div>

        {/* Right: Target */}
        <div className="flex flex-col justify-center flex-1 w-1/3">
          <div className="relative flex justify-center">
            {target ? (
              <Badge
                key={target.value}
                className="bg-background/60 backdrop-blur-md p-2"
                title={target.label}
                variant={"outline"}
              >
                {target.label}
              </Badge>
            ) : (
              <div className="w-full px-4 py-3 bg-background/20 backdrop-blur-sm border border-dashed rounded-full text-sm text-center italic text-muted-foreground">
                {t("notSelected")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
