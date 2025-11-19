/**
 * Admin Artists Page - Server Component
 * Quản lý hoạ sĩ (artists)
 */

import type { Metadata } from "next";
import { ArtistsManagement } from "./artists-management";

export const metadata: Metadata = {
  title: "Quản lý Hoạ sĩ - Admin",
  description: "Quản lý các hoạ sĩ",
};

export default function AdminArtistsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý Hoạ sĩ</h1>
        <p className="text-muted-foreground">
          Thêm, sửa và xóa các hoạ sĩ minh họa
        </p>
      </div>
      <ArtistsManagement />
    </div>
  );
}
