"use client";

/**
 * Authors Management Component - Client Component with URL State
 * CRUD interface for authors with URL-synced pagination and search
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
} from "@/lib/api/models/admin/author";
import { AuthorUtils } from "@/lib/api/models/admin/author";
import { AuthorService } from "@/lib/api/services/admin/author.service";
import { ApiError } from "@/lib/api/utils/error-handler";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/default";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function AuthorsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get state from URL
  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const currentSearch = searchParams.get("search") || "";

  // Data state
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Local search input state (for debouncing)
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  // Form states
  const [formData, setFormData] = useState<
    CreateAuthorRequest | UpdateAuthorRequest
  >({
    name: "",
    biography: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // URL update helpers
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
      router.push(queryString ? `?${queryString}` : window.location.pathname);
    });
  };

  // Fetch authors function
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const result = await AuthorService.getList({
        page: currentPage,
        limit: DEFAULT_LIMIT,
        search: currentSearch || undefined,
        sort_by: "created",
        sort_order: "desc",
      });
      setAuthors(result.items);
      setTotalPages(result.total_pages);
      setTotalItems(result.total_items);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể tải danh sách tác giả";
      toast.error(message);
      setAuthors([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when URL params change
  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentSearch]);

  // Sync search input with URL (when navigating back/forward)
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateURL({ search: searchInput, page: DEFAULT_PAGE });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handlers
  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await AuthorService.create(formData as CreateAuthorRequest);
      toast.success("Đã tạo tác giả thành công");
      setCreateDialogOpen(false);
      setFormData({ name: "", biography: "" });
      fetchAuthors();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể tạo tác giả";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedAuthor) return;
    try {
      setSubmitting(true);
      await AuthorService.update(
        selectedAuthor.id,
        formData as UpdateAuthorRequest
      );
      toast.success("Đã cập nhật tác giả thành công");
      setEditDialogOpen(false);
      setSelectedAuthor(null);
      setFormData({ name: "", biography: "" });
      fetchAuthors();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể cập nhật tác giả";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAuthor) return;
    try {
      setSubmitting(true);
      await AuthorService.delete(selectedAuthor.id);
      toast.success("Đã xóa tác giả thành công");
      setDeleteDialogOpen(false);
      setSelectedAuthor(null);
      fetchAuthors();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Không thể xóa tác giả";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (author: Author) => {
    setSelectedAuthor(author);
    setFormData({
      name: author.name,
      biography: author.description,
      avatar_url: author.avatar_url || undefined,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (author: Author) => {
    setSelectedAuthor(author);
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
                placeholder="Tìm kiếm tác giả..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Thêm tác giả
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
          ) : authors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="size-12 mb-4" />
              <p>Không tìm thấy tác giả nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Xác minh</TableHead>
                    <TableHead className="text-right">Số truyện</TableHead>
                    <TableHead className="text-right">Lượt xem</TableHead>
                    <TableHead className="text-right">Followers</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">
                        {author.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {author.slug}
                      </TableCell>
                      <TableCell>
                        {author.is_verified ? (
                          <Badge variant="default" className="bg-blue-600">
                            <CheckCircle className="size-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="size-3" />
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {author.novel_count}
                      </TableCell>
                      <TableCell className="text-right">
                        {AuthorUtils.formatViews(author.total_views)}
                      </TableCell>
                      <TableCell className="text-right">
                        {AuthorUtils.formatFollowers(author.follower_count)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {AuthorUtils.formatDate(author.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(author)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDeleteDialog(author)}
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
                  {Math.min(currentPage * DEFAULT_LIMIT, totalItems)} / {totalItems}
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
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || isPending}
                    onClick={() => updateURL({ page: currentPage + 1 })}
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
            <DialogTitle>Thêm tác giả mới</DialogTitle>
            <DialogDescription>Tạo một tác giả mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tên</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Tên tác giả"
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
            <DialogTitle>Chỉnh sửa tác giả</DialogTitle>
            <DialogDescription>Cập nhật thông tin tác giả</DialogDescription>
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
              Bạn có chắc muốn xóa tác giả "{selectedAuthor?.name}"? Hành động
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
