"use client";

/**
 * Dashboard Sidebar Component - Client Component
 * Sidebar navigation cho personal workspace using shadcn/ui sidebar
 */

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/routing";
import {
  BarChart3,
  BookOpen,
  FileEdit,
  LayoutDashboard,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");
  const tRoot = useTranslations("dashboard");
  const tQuickActions = useTranslations("dashboard.quickActions");

  const navigation = [
    {
      name: t("overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("myNovels"),
      href: "/dashboard/novels",
      icon: BookOpen,
    },
    {
      name: t("analytics"),
      href: "/dashboard/analytics",
      icon: BarChart3,
      disabled: true,
    },
    {
      name: t("profile"),
      href: "/dashboard/profile",
      icon: User,
      disabled: true,
    },
    {
      name: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
      disabled: true,
    },
  ];

  const quickActions = [
    {
      name: tQuickActions("createNovel"),
      href: "/dashboard/novels/create",
      icon: PlusCircle,
    },
    {
      name: tQuickActions("manageNovels"),
      href: "/dashboard/novels",
      icon: FileEdit,
    },
  ];

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4 md:p-6">
        <div className="flex items-center gap-3 px-2">
          <h1 className="text-xl md:text-2xl font-bold">{tRoot("title")}</h1>
          <Badge variant="secondary" className="text-xs">
            Personal
          </Badge>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                const isDisabled = item.disabled;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      disabled={isDisabled}
                      tooltip={item.name}
                      size="lg"
                      className="h-11 px-4 rounded-xl text-base md:text-sm"
                    >
                      <Link href={isDisabled ? "#" : item.href}>
                        <Icon className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup className="px-3">
          <SidebarGroupLabel>{t("quickActions")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      size="lg"
                      className="h-11 px-4 rounded-xl text-base md:text-sm"
                    >
                      <Link href={item.href}>
                        <Icon className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Info */}
      <SidebarFooter className="p-4 md:p-6">
        <p className="text-xs text-muted-foreground text-center px-2">
          {t("personalContent")}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
