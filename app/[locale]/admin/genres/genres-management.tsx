"use client";

/**
 * Genres Management Component - Client Component
 * CRUD interface for genres
 */

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CreateGenreRequest,
  Genre,
  UpdateGenreRequest,
} from "@/lib/api/models/admin/genre";
import { GenreUtils } from "@/lib/api/models/admin/genre";
import { GenreService } from "@/lib/api/services/admin/genre.service";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function GenresManagement() {
  // State
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  // Form states
  const [formData, setFormData] = useState<
    CreateGenreRequest | UpdateGenreRequest
  >({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch genres
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const result = await GenreService.getList({
        page,
        limit: 20,
        search: search || undefined,
        sort_by: "created",
        sort_order: "desc",
      });
      setGenres(result.items);
      setTotalPages(result.total_pages);
      setTotalItems(result.total_items);
    } catch (error) {
      toast.error("Không thể tải danh sách thể loại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [page, search]);

  // Handlers
  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await GenreService.create(formData as CreateGenreRequest);
      toast.success("Đã tạo thể loại thành công");
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
      fetchGenres();
    } catch (error) {
      toast.error("Không thể tạo thể loại");
      console.error(error);
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
      fetchGenres();
    } catch (error) {
      toast.error("Không thể cập nhật thể loại");
      console.error(error);
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
      fetchGenres();
    } catch (error) {
      toast.error("Không thể xóa thể loại");
      console.error(error);
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Thêm thể loại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : genres.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="size-12 mb-4" />
              <p>Không tìm thấy thể loại nào</p>
            </div>
          ) : (
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
                  {genres.map((genre) => (
                    <TableRow key={genre.id}>
                      <TableCell className="font-medium">
                        {genre.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {genre.slug}
                      </TableCell>
                      <TableCell>
                        {genre.is_active ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="size-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500">
                            <AlertCircle className="size-3" />
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 ${GenreUtils.getTrendBadge(genre.trend).color}`}
                        >
                          {genre.trend === "rising" && (
                            <TrendingUp className="size-3" />
                          )}
                          {genre.trend === "falling" && (
                            <TrendingDown className="size-3" />
                          )}
                          {GenreUtils.getTrendBadge(genre.trend).label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {genre.series_count}
                      </TableCell>
                      <TableCell className="text-right">
                        {GenreUtils.formatViews(genre.total_views)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {GenreUtils.formatDate(genre.created_at)}
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
                  Hiển thị {(page - 1) * 20 + 1}-
                  {Math.min(page * 20, totalItems)} / {totalItems}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thể loại mới</DialogTitle>
            <DialogDescription>
              Tạo một thể loại truyện mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tên</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Fantasy, Romance..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mô tả</label>
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
            <DialogDescription>
              Cập nhật thông tin thể loại
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tên</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mô tả</label>
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
    </div>
  );
}
