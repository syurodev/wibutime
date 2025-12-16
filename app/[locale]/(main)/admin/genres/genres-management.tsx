"use client";

/**
 * Genres Management Component - Client Component with URL State
 * CRUD interface for genres with URL-synced pagination and search
 * Data fetching is handled by server component (page.tsx)
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MergeGenreDialog } from "@/features/genre/components/merge-genre-dialog";
import { GenreService } from "@/features/genre/hooks/use-genres";
import {
  type CreateGenreRequest,
  type Genre,
  type UpdateGenreRequest,
} from "@/features/genre/types";
import { ApiError } from "@/lib/api/utils/error-handler";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/default";
import { formatFullDate } from "@/lib/utils/date-ranges";
import { formatNumber } from "@/lib/utils/format-number";
import {
  AlertCircle,
  Edit2,
  Loader2,
  Merge,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface GenresManagementProps {
  data: {
    items: Genre[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export function GenresManagement({ data }: GenresManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get state from URL
  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const currentSearch = searchParams.get("search") || "";

  // Local search input state (for debouncing)
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  // Form states
  const [formData, setFormData] = useState<
    CreateGenreRequest | UpdateGenreRequest
  >({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // URL update helpers - triggers server component re-fetch via Soft Navigation
  const updateURL = (updates: { page?: number; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle page parameter
    if (updates.page === DEFAULT_PAGE) {
      params.delete("page");
    } else if (updates.page) {
      params.set("page", String(updates.page));
    }

    // Handle search parameter
    if (updates.search === "") {
      params.delete("search");
    } else if (updates.search) {
      params.set("search", updates.search);
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(
        queryString ? `?${queryString}` : globalThis.window.location.pathname
      );
    });
  };

  // Sync search input with URL (when navigating back/forward)
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced search - updates URL which triggers server re-fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateURL({ search: searchInput, page: DEFAULT_PAGE });
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // CRUD Handlers - after mutation, refresh to re-fetch from server
  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await GenreService.create(formData as CreateGenreRequest);
      toast.success("Đã tạo thể loại thành công");
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "" });

      // Trigger server component re-fetch
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không thể tạo thể loại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedGenre) return;
    try {
      setSubmitting(true);
      await GenreService.update(
        selectedGenre.id,
        formData as UpdateGenreRequest
      );
      toast.success("Đã cập nhật thể loại thành công");
      setEditDialogOpen(false);
      setSelectedGenre(null);
      setFormData({ name: "", description: "" });

      // Trigger server component re-fetch
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Không thể cập nhật thể loại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGenre) return;
    try {
      setSubmitting(true);
      await GenreService.delete(selectedGenre.id);
      toast.success("Đã xóa thể loại thành công");
      setDeleteDialogOpen(false);
      setSelectedGenre(null);

      // If current page becomes empty and not first page, go to previous page
      if (data.items.length === 1 && currentPage > 1) {
        updateURL({ page: currentPage - 1 });
      } else {
        // Trigger server component re-fetch
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Không thể xóa thể loại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (genre: Genre) => {
    setSelectedGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description,
      is_active: genre.is_active,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (genre: Genre) => {
    setSelectedGenre(genre);
    setDeleteDialogOpen(true);
  };

  // Helper function to render trend badge
  const renderTrendBadge = (trend: string) => {
    if (trend === "rising") {
      return (
        <Badge variant="default" className="bg-green-600">
          <TrendingUp className="size-3" />
          {trend}
        </Badge>
      );
    }

    if (trend === "falling") {
      return (
        <Badge variant="destructive">
          <TrendingDown className="size-3" />
          {trend}
        </Badge>
      );
    }

    return <Badge variant="secondary">{trend}</Badge>;
  };

  // Helper function to render table content based on state
  const renderTableContent = () => {
    if (data.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="size-12 mb-4" />
          <p>Không tìm thấy thể loại nào</p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Xu hướng</TableHead>
              <TableHead className="text-right">Số truyện</TableHead>
              <TableHead className="text-right">Lượt xem</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {genre.slug}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={genre.is_active ? "active" : "inactive"}
                    className="border-teal-400 bg-transparent"
                  >
                    {genre.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {renderTrendBadge(genre.trend || "stable")}
                </TableCell>
                <TableCell className="text-right">
                  {genre.series_count}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(genre.total_views)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {genre.created_at ? formatFullDate(genre.created_at) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(genre)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDeleteDialog(genre)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * DEFAULT_LIMIT + 1}-
            {Math.min(currentPage * DEFAULT_LIMIT, data.total_items)} /{" "}
            {data.total_items}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isPending}
              onClick={() => updateURL({ page: currentPage - 1 })}
            >
              Trước
            </Button>
            <span className="flex items-center px-3 text-sm">
              Trang {currentPage} / {data.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === data.total_pages || isPending}
              onClick={() => updateURL({ page: currentPage + 1 })}
            >
              Sau
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thể loại..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
              {isPending && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMergeDialogOpen(true)}
              >
                <Merge className="size-4 mr-2" />
                Gộp thể loại
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Thêm thể loại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">{renderTableContent()}</CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thể loại mới</DialogTitle>
            <DialogDescription>Tạo một thể loại truyện mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Tên</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Fantasy, Romance..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Mô tả</Label>
              <Input
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả ngắn về thể loại"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
            <DialogDescription>Cập nhật thông tin thể loại</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Tên</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Mô tả</Label>
              <Input
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={(formData as UpdateGenreRequest).is_active || false}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="size-4"
              />
              <label htmlFor="is_active" className="text-sm">
                Active
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa thể loại "{selectedGenre?.name}"? Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <MergeGenreDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        onSuccess={() => {
          router.refresh(); // Re-fetch from server after merge
        }}
      />
    </div>
  );
}
