/**
 * Dashboard Overview Page
 * Tổng quan workspace cá nhân với thống kê chi tiết và biểu đồ
 */

import { Container } from "@/components/layout/Container";
import {
  getDashboardStats,
  getNovelsByStatus,
  getNovelsTimeSeries,
  getPublishingActivity,
  getTopNovels,
} from "@/lib/api/novels-mock";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  // Fetch dashboard data (currently using mock data)
  const [stats, timeSeries, statusBreakdown, topNovels, publishingActivity] =
    await Promise.all([
      getDashboardStats("user"),
      getNovelsTimeSeries("user", undefined, "30d"),
      getNovelsByStatus("user"),
      getTopNovels("user", undefined, "views", 5),
      getPublishingActivity("user", undefined, "weekly"),
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
    <Container maxWidth="2xl" className="py-8">
      {/* Client-side interactive dashboard */}
      <DashboardContent
        stats={stats}
        timeSeries={timeSeries}
        statusBreakdown={statusBreakdown}
        topNovels={topNovels}
        publishingActivity={publishingActivity}
        engagementMetrics={engagementMetrics}
        ownerType="user"
      />
    </Container>
  );
}
