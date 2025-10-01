"use client";

import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { GenreFormDialog } from "@/components/admin/genre-form-dialog";
import { GenresTable } from "@/components/admin/genres-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import {
    createGenre,
    deleteGenre,
    Genre,
    updateGenre,
    type CreateGenreRequest,
    type UpdateGenreRequest,
} from "@/lib/api/genres/genres.api";
import { ArrowLeft, Plus, Tag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface GenresManagementProps {
    initialGenres: Genre[];
    locale: string;
    permissions: {
        canView: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
}

export function GenresManagement({
    initialGenres,
    locale,
    permissions,
}: GenresManagementProps) {
    const { data: session } = useSession();
    const [genres, setGenres] = useState<Genre[]>(initialGenres);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const permissionBadges = [
        { label: "View", granted: permissions.canView },
        { label: "Create", granted: permissions.canCreate },
        { label: "Update", granted: permissions.canUpdate },
        { label: "Delete", granted: permissions.canDelete },
    ];

    const handleCreateGenre = () => {
        setEditingGenre(null);
        setFormOpen(true);
    };

    const handleEditGenre = (genre: Genre) => {
        setEditingGenre(genre);
        setFormOpen(true);
    };

    const handleDeleteGenre = (genre: Genre) => {
        setDeletingGenre(genre);
        setDeleteOpen(true);
    };

    const handleFormSubmit = async (data: { name: string }) => {
        setFormLoading(true);
        try {
            let response;

            if (editingGenre) {
                const updateData: UpdateGenreRequest = { name: data.name };
                response = await updateGenre(editingGenre.id, updateData);
                toast.success("Genre updated successfully");
            } else {
                const createData: CreateGenreRequest = { name: data.name };
                response = await createGenre(createData);
                toast.success("Genre created successfully");
            }

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            // Update local state with new/updated genre
            if (editingGenre) {
                setGenres((prev) =>
                    prev.map((g) =>
                        g.id === editingGenre.id ? response.data : g,
                    ),
                );
            } else {
                setGenres((prev) => [...prev, response.data]);
            }

            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save genre:", error);
            if (error instanceof ApiError) {
                toast.error(
                    `${editingGenre ? "Failed to update" : "Failed to create"} genre: ${error.message}`,
                );
            } else {
                toast.error(
                    editingGenre
                        ? "Failed to update genre"
                        : "Failed to create genre",
                );
            }
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingGenre) return;

        setDeleteLoading(true);
        try {
            const response = await deleteGenre(deletingGenre.id);

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            toast.success("Genre deleted successfully");

            // Update local state by removing deleted genre
            setGenres((prev) => prev.filter((g) => g.id !== deletingGenre.id));
            setDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete genre:", error);
            if (error instanceof ApiError) {
                toast.error(`Failed to delete genre: ${error.message}`);
            } else {
                toast.error("Failed to delete genre");
            }
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setDeleteLoading(false);
        }
    };

    const systemHref = `/${locale}/admin/system`;

    return (
        <>
            <section className="container mx-auto max-w-6xl space-y-8 py-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Tag className="h-5 w-5" />
                            <span className="text-xs font-medium uppercase tracking-wide">
                                Master Data
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Genres
                            </h1>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                Quản lý danh sách thể loại sử dụng trên toàn hệ
                                thống. Các thay đổi sẽ áp dụng cho nội dung, lọc
                                và đề xuất.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={systemHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại System
                            </Link>
                        </Button>
                        {permissions.canCreate && (
                            <Button
                                onClick={handleCreateGenre}
                                size="sm"
                                className="sm:min-w-[160px]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm thể loại
                            </Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-base">
                            Quyền hiện có
                        </CardTitle>
                        <CardDescription>
                            Các quyền được cấp cho tài khoản của bạn đối với
                            master data thể loại.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {permissionBadges.map((item) => (
                                <Badge
                                    key={item.label}
                                    variant="outline"
                                    className={
                                        item.granted
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                            : "border-dashed text-muted-foreground"
                                    }
                                >
                                    {item.label}
                                    <span className="ml-1 text-xs">
                                        {item.granted ? "✓" : "✗"}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-base">
                            Danh sách thể loại
                        </CardTitle>
                        <CardDescription>
                            Thêm mới, cập nhật hoặc vô hiệu hoá các thể loại
                            hiển thị cho người dùng.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GenresTable
                            data={genres}
                            session={session}
                            onEdit={handleEditGenre}
                            onDelete={handleDeleteGenre}
                        />
                    </CardContent>
                </Card>
            </section>

            {/* Dialogs */}
            <GenreFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                genre={editingGenre}
                onSubmit={handleFormSubmit}
                isLoading={formLoading}
            />

            <DeleteConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Genre"
                description={`Are you sure you want to delete "${deletingGenre?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
            />
        </>
    );
}
