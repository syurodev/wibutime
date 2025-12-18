"use client";

/**
 * Admin Sidebar Component - Client Component
 * Sidebar navigation cho admin pages using shadcn/ui sidebar
 */

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/routing";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  Tags,
  Users,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Tổng quan",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Thể loại",
      href: "/admin/genres",
      icon: Tags,
    },
    {
      name: "Tác giả",
      href: "/admin/authors",
      icon: Users,
    },
    {
      name: "Hoạ sĩ",
      href: "/admin/artists",
      icon: Palette,
    },
    {
      name: "Thanh toán",
      href: "/admin/payment/config",
      icon: CreditCard,
    },
    {
      name: "Truyện",
      href: "/admin/novels",
      icon: BookOpen,
      disabled: true,
    },
    {
      name: "Cài đặt",
      href: "/admin/settings",
      icon: Settings,
      disabled: true,
    },
  ];

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4 md:p-6">
        <div className="flex items-center gap-3 px-2">
          <Shield className="size-6" />
          <h1 className="text-xl md:text-2xl font-bold">Admin Panel</h1>
          <Badge variant="destructive" className="text-xs">
            Admin
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
      </SidebarContent>

      {/* Footer Info */}
      <SidebarFooter className="p-4 md:p-6">
        <p className="text-xs text-muted-foreground text-center px-2">
          WibuTime Admin v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
