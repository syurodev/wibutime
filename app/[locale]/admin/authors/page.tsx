/**
 * Admin Authors Page - Server Component
 * Quản lý tác giả (authors)
 */

import type { Metadata } from "next";
import { AuthorsManagement } from "./authors-management";

export const metadata: Metadata = {
  title: "Quản lý Tác giả - Admin",
  description: "Quản lý các tác giả truyện",
};

export default function AdminAuthorsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý Tác giả</h1>
        <p className="text-muted-foreground">
          Thêm, sửa và xóa các tác giả truyện
        </p>
      </div>
      <AuthorsManagement />
    </div>
  );
}
