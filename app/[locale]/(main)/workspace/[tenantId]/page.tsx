/**
 * Workspace Overview Page
 * Tổng quan workspace của tenant với thống kê chi tiết và biểu đồ
 */

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Container } from "@/components/layout/Container";
import { DashboardContent } from "../../dashboard/dashboard-content";
import {
  getDashboardStats,
  getNovelsTimeSeries,
  getNovelsByStatus,
  getTopNovels,
  getPublishingActivity,
} from "@/lib/api/novels-mock";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{
    tenantId: string;
  }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { tenantId } = await params;
  const t = await getTranslations("workspace");

  // Fetch workspace dashboard data (currently using mock data)
  const [stats, timeSeries, statusBreakdown, topNovels, publishingActivity] =
    await Promise.all([
      getDashboardStats("tenant", tenantId),
      getNovelsTimeSeries("tenant", tenantId, "30d"),
      getNovelsByStatus("tenant", tenantId),
      getTopNovels("tenant", tenantId, "views", 5),
      getPublishingActivity("tenant", tenantId, "weekly"),
    ]);

  // Calculate engagement metrics from stats
  const engagementMetrics = [
    {
      type: "views" as const,
      value: stats.totalViews,
      percentage: 0, // Will be calculated in component
    },
    {
      type: "favorites" as const,
      value: stats.totalFavorites,
      percentage: 0,
    },
    {
      type: "ratings" as const,
      value: Math.round(stats.averageRating * 1000), // Convert to count
      percentage: 0,
    },
    {
      type: "comments" as const,
      value: Math.round(stats.totalViews * 0.05), // Mock: 5% of views
      percentage: 0,
    },
  ];

  return (
    <Container maxWidth="2xl" className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Client-side interactive dashboard */}
      <DashboardContent
        stats={stats}
        timeSeries={timeSeries}
        statusBreakdown={statusBreakdown}
        topNovels={topNovels}
        publishingActivity={publishingActivity}
        engagementMetrics={engagementMetrics}
        ownerType="tenant"
      />
    </Container>
  );
}
