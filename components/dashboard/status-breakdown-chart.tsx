"use client";

/**
 * StatusBreakdownChart Component
 * Pie/Donut chart showing distribution of novels by status
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NovelStatusBreakdown } from "@/features/novel/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface StatusBreakdownChartProps {
  data: NovelStatusBreakdown[];
  title?: string;
  isLoading?: boolean;
}

const STATUS_CONFIG = {
  draft: {
    label: "Nháp",
    color: "hsl(var(--muted-foreground))",
    variant: "secondary" as const,
  },
  ongoing: {
    label: "Đang tiến hành",
    color: "hsl(142, 76%, 36%)", // Green
    variant: "default" as const,
  },
  completed: {
    label: "Hoàn thành",
    color: "hsl(221, 83%, 53%)", // Blue
    variant: "default" as const,
  },
  hiatus: {
    label: "Tạm ngưng",
    color: "hsl(48, 96%, 53%)", // Yellow
    variant: "outline" as const,
  },
  dropped: {
    label: "Đã bỏ",
    color: "hsl(0, 84%, 60%)", // Red
    variant: "destructive" as const,
  },
};

export function StatusBreakdownChart({
  data,
  title = "Phân bố trạng thái",
  isLoading,
}: StatusBreakdownChartProps) {
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

  // Filter out statuses with zero count
  const chartData = data.filter((item) => item.count > 0);

  if (chartData.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_CONFIG[entry.status].color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as NovelStatusBreakdown;
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-3 rounded-full"
                              style={{
                                backgroundColor:
                                  STATUS_CONFIG[data.status].color,
                              }}
                            />
                            <span className="font-medium">
                              {STATUS_CONFIG[data.status].label}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Số lượng:
                              </span>{" "}
                              <span className="font-semibold">
                                {data.count}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Tỷ lệ:
                              </span>{" "}
                              <span className="font-semibold">
                                {data.percentage.toFixed(1)}%
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {chartData.map((item) => {
              const config = STATUS_CONFIG[item.status];
              return (
                <div
                  key={item.status}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * StatusBreakdownChart Skeleton for loading states
 */
export function StatusBreakdownChartSkeleton() {
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
