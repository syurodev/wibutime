"use client";

import { Badge } from "@/components/ui/badge";
import { Milestone, MilestoneUtils } from "@/features/community";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Clock,
  Eye,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Get icon component based on milestone icon name
 */
function getMilestoneIcon(iconName: string) {
  const iconMap: Record<string, typeof Trophy> = {
    trophy: Trophy,
    "book-open": BookOpen,
    users: Users,
    eye: Eye,
    star: Star,
    "trending-up": TrendingUp,
    clock: Clock,
    award: Award,
  };

  return iconMap[iconName] || Trophy;
}

/**
 * Get color based on milestone type
 */
function getMilestoneColor(type: string) {
  const colorMap: Record<string, string> = {
    platform: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    series: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    creator: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    community: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return colorMap[type] || "bg-muted text-muted-foreground border-border";
}

/**
 * Individual Milestone Card
 */
export function MilestoneCard({
  milestone,
}: {
  readonly milestone: Milestone;
}) {
  const Icon = getMilestoneIcon(milestone.icon);
  const colorClass = getMilestoneColor(milestone.type);
  const [timeSince, setTimeSince] = useState("");

  useEffect(() => {
    setTimeSince(MilestoneUtils.getTimeSince(milestone.achieved_at));
  }, [milestone.achieved_at]);

  return (
    <div className="group relative rounded-[20px] border-4 border-secondary bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn("shrink-0 rounded-lg border-2 p-3", colorClass)}>
            <Icon className="size-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Type Badge & Time */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {milestone.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{timeSince}</span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg line-clamp-2">
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {milestone.description}
            </p>

            {/* Value */}
            <div className="flex items-center gap-2 pt-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                {MilestoneUtils.formatValue(milestone.value)}
              </div>
            </div>

            {/* Context Info (if available) */}
            {(milestone.series_title || milestone.creator_name) && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {milestone.series_title && (
                    <span>Series: {milestone.series_title}</span>
                  )}
                  {milestone.creator_name && (
                    <span>Creator: {milestone.creator_name}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
