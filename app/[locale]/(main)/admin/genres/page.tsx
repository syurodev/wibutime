/**
 * Admin Genres Page - Server Component
 * Quản lý thể loại (genres)
 */

import type { Metadata } from "next";
import { GenresManagement } from "./genres-management";

export const metadata: Metadata = {
  title: "Quản lý Thể loại - Admin",
  description: "Quản lý các thể loại truyện",
};

export default function AdminGenresPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý Thể loại</h1>
        <p className="text-muted-foreground">
          Thêm, sửa và xóa các thể loại truyện
        </p>
      </div>
      <GenresManagement />
    </div>
  );
}
