"use client";

/**
 * EngagementMetricsChart Component
 * Displays engagement metrics breakdown with percentages
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, Star, MessageSquare } from "lucide-react";
import { formatNumber, formatPercentage } from "@/lib/utils/format-number";
import { cn } from "@/lib/utils";

export interface EngagementMetric {
  type: "views" | "favorites" | "ratings" | "comments";
  value: number;
  percentage: number;
  trend?: number;
}

export interface EngagementMetricsChartProps {
  metrics: EngagementMetric[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const METRIC_CONFIG = {
  views: {
    label: "Lượt xem",
    icon: Eye,
    color: "hsl(var(--chart-1))",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-500",
  },
  favorites: {
    label: "Yêu thích",
    icon: Heart,
    color: "hsl(var(--chart-2))",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-600 dark:text-pink-500",
  },
  ratings: {
    label: "Đánh giá",
    icon: Star,
    color: "hsl(var(--chart-3))",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-600 dark:text-yellow-500",
  },
  comments: {
    label: "Bình luận",
    icon: MessageSquare,
    color: "hsl(var(--chart-4))",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600 dark:text-green-500",
  },
};

export function EngagementMetricsChart({
  metrics,
  title = "Tương tác người dùng",
  description,
  isLoading,
}: EngagementMetricsChartProps) {
  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total for percentages
  const total = metrics.reduce((sum, m) => sum + m.value, 0);

  // Sort metrics by value descending
  const sortedMetrics = [...metrics].sort((a, b) => b.value - a.value);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMetrics.map((metric) => {
            const config = METRIC_CONFIG[metric.type];
            const Icon = config.icon;
            const percentage = total > 0 ? (metric.value / total) * 100 : 0;

            return (
              <div key={metric.type} className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        config.bgColor
                      )}
                    >
                      <Icon className={cn("size-4", config.textColor)} />
                    </div>
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {formatNumber(metric.value)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="mt-6 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Tổng tương tác
            </span>
            <span className="text-2xl font-bold">{formatNumber(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * EngagementMetricsChart Skeleton for loading states
 */
export function EngagementMetricsChartSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
