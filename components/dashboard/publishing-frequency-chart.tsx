"use client";

/**
 * PublishingFrequencyChart Component
 * Bar chart showing publishing activity over time
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { PublishingActivityData } from "@/features/novel/types";
import { formatChartDate } from "@/lib/utils/date-ranges";
import { formatNumber } from "@/lib/utils/format-number";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export interface PublishingFrequencyChartProps {
  data: PublishingActivityData[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  period?: "daily" | "weekly" | "monthly";
}

export function PublishingFrequencyChart({
  data,
  title = "Hoạt động xuất bản",
  description,
  isLoading,
  period = "weekly",
}: PublishingFrequencyChartProps) {
  const chartConfig = {
    chaptersPublished: {
      label: "Chương đã xuất bản",
      color: "hsl(var(--chart-1))",
    },
  };

  const chartData = data.map((item) => ({
    period: formatChartDate(item.period),
    fullPeriod: item.period,
    chapters: item.chaptersPublished,
    words: item.wordsPublished,
  }));

  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="period"
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
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="mb-2 font-medium">{data.period}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            Chương đã xuất bản:
                          </span>
                          <span className="font-semibold">{data.chapters}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            Từ viết:
                          </span>
                          <span className="font-semibold">
                            {formatNumber(data.words)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="chapters"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Tổng chương</p>
            <p className="mt-1 text-xl font-bold">
              {chartData.reduce((sum, item) => sum + item.chapters, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tổng từ</p>
            <p className="mt-1 text-xl font-bold">
              {formatNumber(
                chartData.reduce((sum, item) => sum + item.words, 0)
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * PublishingFrequencyChart Skeleton for loading states
 */
export function PublishingFrequencyChartSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
