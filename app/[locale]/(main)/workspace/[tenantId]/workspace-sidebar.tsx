"use client";

/**
 * Workspace Sidebar Component - Client Component
 * Sidebar navigation cho tenant workspace using shadcn/ui sidebar
 */

import { Link, usePathname } from "@/i18n/routing";
import {
  BookOpen,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  PlusCircle,
  FileEdit,
} from "lucide-react";
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
import { useTranslations } from "next-intl";

interface WorkspaceSidebarProps {
  tenantId: string;
}

export function WorkspaceSidebar({ tenantId }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("workspace.sidebar");
  const tQuickActions = useTranslations("workspace.quickActions");

  // TODO: Fetch tenant info from API
  const tenant = {
    id: tenantId,
    name: useTranslations("workspace")("title"),
  };

  const navigation = [
    {
      name: t("overview"),
      href: `/workspace/${tenantId}`,
      icon: LayoutDashboard,
    },
    {
      name: t("teamNovels"),
      href: `/workspace/${tenantId}/novels`,
      icon: BookOpen,
    },
    {
      name: t("members"),
      href: `/workspace/${tenantId}/members`,
      icon: Users,
      disabled: true,
    },
    {
      name: t("analytics"),
      href: `/workspace/${tenantId}/analytics`,
      icon: BarChart3,
      disabled: true,
    },
    {
      name: t("settings"),
      href: `/workspace/${tenantId}/settings`,
      icon: Settings,
      disabled: true,
    },
  ];

  const quickActions = [
    {
      name: tQuickActions("createNovel"),
      href: `/workspace/${tenantId}/novels/create`,
      icon: PlusCircle,
    },
    {
      name: tQuickActions("manageNovels"),
      href: `/workspace/${tenantId}/novels`,
      icon: FileEdit,
    },
  ];

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4 md:p-6">
        <div className="flex items-center gap-3 px-2">
          <h1 className="text-xl md:text-2xl font-bold truncate">{tenant.name}</h1>
          <Badge variant="default" className="text-xs">
            Team
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
          {useTranslations("workspace")("teamContent")}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
