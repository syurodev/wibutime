/**
 * StatCard Component
 * Displays a KPI metric with optional trend indicator and sparkline
 */

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getTrendColor } from "@/lib/utils/format-stats";
import { Activity, LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string; // e.g., "vs last month"
  };
  formatter?: (value: number) => string;
  sparklineData?: number[]; // For future sparkline implementation
  isLoading?: boolean;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  formatter,
  sparklineData,
  isLoading,
  iconClassName,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-10 rounded-lg" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayValue =
    typeof value === "number" && formatter ? formatter(value) : value;
  const isPositiveTrend = trend ? trend.value >= 0 : undefined;

  return (
    <Card className="rounded-xl transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        {/* Header: Title + Icon */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              iconClassName || "bg-primary/10 text-primary dark:bg-primary/20"
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>

        {/* Value */}
        <div className="mt-4">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
            {displayValue}
          </h3>

          {/* Trend Indicator */}
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPositiveTrend !== undefined && (
                <>
                  {isPositiveTrend ? (
                    <TrendingUp className="size-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600 dark:text-red-500" />
                  )}
                </>
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  getTrendColor(trend.value)
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value.toFixed(1)}%
              </span>
              {trend.label && (
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              )}
            </div>
          )}

          {/* TODO: Add sparkline mini chart if sparklineData is provided */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-3">
              {/* Placeholder for future sparkline implementation */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * StatCard Skeleton for loading states
 */
export function StatCardSkeleton() {
  return <StatCard title="" value={0} icon={Activity} isLoading />;
}
