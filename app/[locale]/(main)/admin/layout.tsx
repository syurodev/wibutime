/**
 * Admin Layout - Server Component
 * Layout với sidebar navigation cho admin pages
 */

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
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
