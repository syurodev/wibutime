/**
 * Admin Layout - Server Component
 * Layout với sidebar navigation cho admin pages
 */

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { AdminSidebar } from "./admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard - WibuTime",
  description: "Quản lý nội dung và hệ thống",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="px-4 md:px-6">
        <div className="pb-20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
