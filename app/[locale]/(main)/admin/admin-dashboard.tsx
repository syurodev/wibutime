"use client";

/**
 * Admin Dashboard Component - Client Component
 * Dashboard với thống kê tổng quan
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Palette, Tags, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Thể loại",
    value: "0",
    description: "Tổng số thể loại",
    icon: Tags,
    href: "/admin/genres",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Tác giả",
    value: "0",
    description: "Tổng số tác giả",
    icon: Users,
    href: "/admin/authors",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Hoạ sĩ",
    value: "0",
    description: "Tổng số hoạ sĩ",
    icon: Palette,
    href: "/admin/artists",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Truyện",
    value: "0",
    description: "Tổng số truyện",
    icon: BookOpen,
    href: "#",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
];

const quickActions = [
  {
    title: "Quản lý Thể loại",
    description: "Thêm, sửa, xóa thể loại truyện",
    href: "/admin/genres",
    icon: Tags,
  },
  {
    title: "Quản lý Tác giả",
    description: "Quản lý thông tin tác giả",
    href: "/admin/authors",
    icon: Users,
  },
  {
    title: "Quản lý Hoạ sĩ",
    description: "Quản lý thông tin hoạ sĩ",
    href: "/admin/artists",
    icon: Palette,
  },
];

export function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng đến với trang quản trị WibuTime
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group"
              onClick={(e) => {
                if (stat.href === "#") e.preventDefault();
              }}
            >
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                    >
                      <Icon className="size-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="transition-all hover:shadow-md hover:border-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="text-base">
                        {action.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <TrendingUp className="size-12 mb-4 opacity-50" />
              <p className="text-sm">Chưa có hoạt động nào</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
