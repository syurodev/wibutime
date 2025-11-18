"use client";

/**
 * Admin Sidebar Component - Client Component
 * Sidebar navigation cho admin pages
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tags,
  Users,
  Palette,
  BookOpen,
  Settings,
  ChevronRight,
} from "lucide-react";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          return (
            <Link
              key={item.href}
              href={isDisabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isDisabled
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={(e) => {
                if (isDisabled) e.preventDefault();
              }}
            >
              <Icon className="size-5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="size-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          WibuTime Admin v1.0
        </p>
      </div>
    </aside>
  );
}
