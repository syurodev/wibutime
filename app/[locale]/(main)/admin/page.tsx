/**
 * Admin Dashboard Page - Server Component
 * Trang tổng quan admin
 */

import type { Metadata } from "next";
import { AdminDashboard } from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Tổng quan - Admin",
  description: "Dashboard quản lý hệ thống",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
