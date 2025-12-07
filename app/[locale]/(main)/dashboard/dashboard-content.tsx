"use client";

/**
 * DashboardContent Component
 * Client component for interactive dashboard with charts
 */

import type { EngagementMetric } from "@/components/dashboard/engagement-metrics-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  DashboardStats,
  NovelStatusBreakdown,
  PublishingActivityData,
  TimeSeriesData,
  TopNovel,
} from "@/features/novel/types";
import type { DateRange } from "@/lib/utils/date-ranges";
import { formatNumber, formatRating } from "@/lib/utils/format-number";
import { BookOpen, Eye, FileText, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic imports cho chart components (giảm initial bundle size)
const TimeSeriesChart = dynamic(
  () =>
    import("@/components/dashboard/time-series-chart").then(
      (m) => m.TimeSeriesChart
    ),
  { loading: () => <Skeleton className="h-80 rounded-xl" /> }
);

const StatusBreakdownChart = dynamic(
  () =>
    import("@/components/dashboard/status-breakdown-chart").then(
      (m) => m.StatusBreakdownChart
    ),
  { loading: () => <Skeleton className="h-80 rounded-xl" /> }
);

const TopNovelsTable = dynamic(
  () =>
    import("@/components/dashboard/top-novels-table").then(
      (m) => m.TopNovelsTable
    ),
  { loading: () => <Skeleton className="h-80 rounded-xl" /> }
);

const PublishingFrequencyChart = dynamic(
  () =>
    import("@/components/dashboard/publishing-frequency-chart").then(
      (m) => m.PublishingFrequencyChart
    ),
  { loading: () => <Skeleton className="h-80 rounded-xl" /> }
);

const EngagementMetricsChart = dynamic(
  () =>
    import("@/components/dashboard/engagement-metrics-chart").then(
      (m) => m.EngagementMetricsChart
    ),
  { loading: () => <Skeleton className="h-80 rounded-xl" /> }
);

interface DashboardContentProps {
  stats: DashboardStats;
  timeSeries: TimeSeriesData[];
  statusBreakdown: NovelStatusBreakdown[];
  topNovels: TopNovel[];
  publishingActivity: PublishingActivityData[];
  engagementMetrics: EngagementMetric[];
  ownerType: "user" | "tenant";
}

import { SidebarTrigger } from "@/components/ui/sidebar";

// ...

export function DashboardContent({
  stats,
  timeSeries: initialTimeSeries,
  statusBreakdown,
  topNovels,
  publishingActivity,
  engagementMetrics,
  ownerType,
}: DashboardContentProps) {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [timeSeries, setTimeSeries] = useState(initialTimeSeries);

  const t = useTranslations("dashboard");
  const tStats = useTranslations("dashboard.stats");
  const tCharts = useTranslations("dashboard.charts");

  // Handle date range change for time series chart
  const handleDateRangeChange = async (newRange: DateRange) => {
    setDateRange(newRange);
    // TODO: Fetch new data from API when backend is ready
    // const newData = await getNovelsTimeSeries(ownerType, undefined, newRange);
    // setTimeSeries(newData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>
      </div>
      {/* KPI Stats Grid - 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={tStats("totalNovels")}
          value={stats.totalNovels}
          icon={BookOpen}
          trend={
            stats.trend
              ? {
                  value: stats.trend.novels,
                  label: tStats("trends.vsLastMonth"),
                }
              : undefined
          }
          iconClassName="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500"
        />
        <StatCard
          title={tStats("totalChapters")}
          value={stats.totalChapters}
          icon={FileText}
          trend={
            stats.trend
              ? {
                  value: stats.trend.chapters,
                  label: tStats("trends.vsLastMonth"),
                }
              : undefined
          }
          iconClassName="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500"
        />
        <StatCard
          title={tStats("totalViews")}
          value={stats.totalViews}
          icon={Eye}
          formatter={formatNumber}
          trend={
            stats.trend
              ? {
                  value: stats.trend.views,
                  label: tStats("trends.vsLastMonth"),
                }
              : undefined
          }
          iconClassName="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-500"
        />
        <StatCard
          title={tStats("averageRating")}
          value={stats.averageRating}
          icon={Heart}
          formatter={formatRating}
          trend={
            stats.trend
              ? {
                  value: stats.trend.favorites,
                  label: tStats("trends.favorites"),
                }
              : undefined
          }
          iconClassName="bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-500"
        />
      </div>

      {/* Time Series Chart - Full width */}
      <TimeSeriesChart
        data={timeSeries}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        title={tCharts("viewsAndChapters.title")}
        description={tCharts("viewsAndChapters.description")}
        chartType="area"
      />

      {/* Two-column Grid: Status Breakdown + Top Novels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusBreakdownChart data={statusBreakdown} />
        <TopNovelsTable
          data={topNovels}
          ownerType={ownerType}
          viewAllHref={ownerType === "user" ? "/dashboard/novels" : undefined}
        />
      </div>

      {/* Two-column Grid: Publishing Frequency + Engagement Metrics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PublishingFrequencyChart
          data={publishingActivity}
          title={tCharts("publishingActivity.title")}
          description={tCharts("publishingActivity.description")}
          period="weekly"
        />
        <EngagementMetricsChart
          metrics={engagementMetrics}
          title={tCharts("engagement.title")}
          description={tCharts("engagement.description")}
        />
      </div>
    </div>
  );
}
