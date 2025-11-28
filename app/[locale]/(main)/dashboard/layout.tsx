/**
 * Dashboard Layout - Server Component
 * Personal workspace layout với shadcn/ui sidebar
 */

import type { Metadata } from "next";
import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard - WibuTime",
  description: "Quản lý nội dung cá nhân của bạn",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="px-4 md:px-6">
        <div className="pb-20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
