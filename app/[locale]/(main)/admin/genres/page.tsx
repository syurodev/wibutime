/**
 * Admin Genres Page - Server Component
 * Quản lý thể loại (genres)
 */

import { getGenres } from "@/features/genre/queries";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/default";
import type { Metadata } from "next";
import { GenresManagement } from "./genres-management";

export const metadata: Metadata = {
  title: "Quản lý Thể loại - Admin",
  description: "Quản lý các thể loại truyện",
};

export default async function AdminGenresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || DEFAULT_PAGE;
  const search = typeof params.search === "string" ? params.search : "";

  // Fetch genres on server-side
  const initialData = await getGenres({
    page,
    limit: DEFAULT_LIMIT,
    search: search || undefined,
    sort_by: "created",
    sort_order: "desc",
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý Thể loại</h1>
        <p className="text-muted-foreground">
          Thêm, sửa và xóa các thể loại truyện
        </p>
      </div>
      <GenresManagement data={initialData} />
    </div>
  );
}
