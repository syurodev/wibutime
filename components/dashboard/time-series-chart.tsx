"use client";

/**
 * TimeSeriesChart Component
 * Line/Area chart showing metrics over time with date range selector
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimeSeriesData } from "@/features/novel/types";
import type { DateRange } from "@/lib/utils/date-ranges";
import { formatChartDate } from "@/lib/utils/date-ranges";
import { formatNumber } from "@/lib/utils/format-number";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

export interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  chartType?: "line" | "area";
}

const DATE_RANGE_OPTIONS = [
  { value: "7d" as DateRange, label: "7 ngày" },
  { value: "30d" as DateRange, label: "30 ngày" },
  { value: "90d" as DateRange, label: "90 ngày" },
  { value: "1y" as DateRange, label: "1 năm" },
];

export function TimeSeriesChart({
  data,
  dateRange,
  onDateRangeChange,
  title = "Lượt xem & Tương tác",
  description,
  isLoading,
  chartType = "area",
}: TimeSeriesChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(["views", "chapters"])
  );

  const chartConfig = {
    views: {
      label: "Lượt xem",
      color: "hsl(var(--chart-1))",
    },
    chapters: {
      label: "Chương mới",
      color: "hsl(var(--chart-2))",
    },
    novels: {
      label: "Novel mới",
      color: "hsl(var(--chart-3))",
    },
    favorites: {
      label: "Yêu thích",
      color: "hsl(var(--chart-4))",
    },
  };

  // Format data for chart
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: formatChartDate(item.date),
      fullDate: item.date,
      views: item.views,
      chapters: item.chapters,
      novels: item.novels || 0,
      favorites: item.favorites || 0,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full md:h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Date Range Selector */}
          <Tabs
            value={dateRange}
            onValueChange={(value) => onDateRangeChange(value as DateRange)}
          >
            <TabsList>
              {DATE_RANGE_OPTIONS.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full md:h-[400px]"
        >
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorChapters" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="chapters"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorChapters)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="chapters"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * TimeSeriesChart Skeleton for loading states
 */
export function TimeSeriesChartSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full md:h-[400px]" />
      </CardContent>
    </Card>
  );
}
