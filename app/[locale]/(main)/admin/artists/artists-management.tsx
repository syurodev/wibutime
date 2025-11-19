"use client";

/**
 * Artists Management Component - Client Component
 * CRUD interface for artists
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
  Artist,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "@/lib/api/models/admin/artist";
import {
  ARTIST_SPECIALIZATION_LABELS,
  ARTIST_SPECIALIZATIONS,
  ArtistUtils,
} from "@/lib/api/models/admin/artist";
import { ArtistService } from "@/lib/api/services/admin/artist.service";
import { ApiError } from "@/lib/api/utils/error-handler";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ArtistsManagement() {
  // State
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Form states
  const [formData, setFormData] = useState<
    CreateArtistRequest | UpdateArtistRequest
  >({
    name: "",
    biography: "",
    specialization: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch artists
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const result = await ArtistService.getList({
        page,
        limit: 20,
        search: search || undefined,
        sort_by: "created",
        sort_order: "desc",
      });
      setArtists(result.items);
      setTotalPages(result.total_pages);
      setTotalItems(result.total_items);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể tải danh sách hoạ sĩ";
      toast.error(message);
      setArtists([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [page, search]);

  // Handlers
  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await ArtistService.create(formData as CreateArtistRequest);
      toast.success("Đã tạo hoạ sĩ thành công");
      setCreateDialogOpen(false);
      setFormData({ name: "", biography: "", specialization: "" });
      fetchArtists();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể tạo hoạ sĩ";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedArtist) return;
    try {
      setSubmitting(true);
      await ArtistService.update(
        selectedArtist.id,
        formData as UpdateArtistRequest
      );
      toast.success("Đã cập nhật hoạ sĩ thành công");
      setEditDialogOpen(false);
      setSelectedArtist(null);
      setFormData({ name: "", biography: "", specialization: "" });
      fetchArtists();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể cập nhật hoạ sĩ";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArtist) return;
    try {
      setSubmitting(true);
      await ArtistService.delete(selectedArtist.id);
      toast.success("Đã xóa hoạ sĩ thành công");
      setDeleteDialogOpen(false);
      setSelectedArtist(null);
      fetchArtists();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể xóa hoạ sĩ";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (artist: Artist) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name,
      biography: artist.description,
      avatar_url: artist.avatar_url || undefined,
      specialization: artist.specialization,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (artist: Artist) => {
    setSelectedArtist(artist);
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
                placeholder="Tìm kiếm hoạ sĩ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Thêm hoạ sĩ
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
          ) : artists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="size-12 mb-4" />
              <p>Không tìm thấy hoạ sĩ nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Chuyên môn</TableHead>
                    <TableHead>Xác minh</TableHead>
                    <TableHead className="text-right">Số truyện</TableHead>
                    <TableHead className="text-right">Artworks</TableHead>
                    <TableHead className="text-right">Followers</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell className="font-medium">
                        {artist.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {artist.slug}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm px-2 py-1 rounded-md bg-muted">
                          {ArtistUtils.getSpecializationLabel(
                            artist.specialization
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        {artist.is_verified ? (
                          <span className="inline-flex items-center gap-1 text-blue-600">
                            <CheckCircle className="size-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500">
                            <AlertCircle className="size-3" />
                            Unverified
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {artist.novel_count}
                      </TableCell>
                      <TableCell className="text-right">
                        {artist.artwork_count}
                      </TableCell>
                      <TableCell className="text-right">
                        {ArtistUtils.formatFollowers(artist.follower_count)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ArtistUtils.formatDate(artist.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(artist)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDeleteDialog(artist)}
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
            <DialogTitle>Thêm hoạ sĩ mới</DialogTitle>
            <DialogDescription>Tạo một hoạ sĩ mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tên</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Tên hoạ sĩ"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tiểu sử</label>
              <Input
                value={formData.biography || ""}
                onChange={(e) =>
                  setFormData({ ...formData, biography: e.target.value })
                }
                placeholder="Tiểu sử ngắn"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Avatar URL
              </label>
              <Input
                value={formData.avatar_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Chuyên môn
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value="">-- Chọn chuyên môn --</option>
                {Object.entries(ARTIST_SPECIALIZATION_LABELS).map(
                  ([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  )
                )}
              </select>
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
            <DialogTitle>Chỉnh sửa hoạ sĩ</DialogTitle>
            <DialogDescription>Cập nhật thông tin hoạ sĩ</DialogDescription>
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
              <label className="text-sm font-medium mb-2 block">Tiểu sử</label>
              <Input
                value={formData.biography || ""}
                onChange={(e) =>
                  setFormData({ ...formData, biography: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Avatar URL
              </label>
              <Input
                value={formData.avatar_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Chuyên môn
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value="">-- Chọn chuyên môn --</option>
                {Object.entries(ARTIST_SPECIALIZATION_LABELS).map(
                  ([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  )
                )}
              </select>
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
              Bạn có chắc muốn xóa hoạ sĩ "{selectedArtist?.name}"? Hành động
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
