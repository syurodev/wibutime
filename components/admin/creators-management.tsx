"use client";

import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { CreatorFormDialog } from "@/components/admin/creator-form-dialog";
import { CreatorsTable } from "@/components/admin/creators-table";
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
    createCreator,
    deleteCreator,
    Creator,
    updateCreator,
    type CreateCreatorRequest,
    type UpdateCreatorRequest,
} from "@/lib/api/creators/creators.api";
import { ArrowLeft, Plus, Palette } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface CreatorsManagementProps {
    initialCreators: Creator[];
    locale: string;
    permissions: {
        canView: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
}

export function CreatorsManagement({
    initialCreators,
    locale,
    permissions,
}: CreatorsManagementProps) {
    const { data: session } = useSession();
    const [creators, setCreators] = useState<Creator[]>(initialCreators);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
    const [deletingCreator, setDeletingCreator] = useState<Creator | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const permissionBadges = [
        { label: "View", granted: permissions.canView },
        { label: "Create", granted: permissions.canCreate },
        { label: "Update", granted: permissions.canUpdate },
        { label: "Delete", granted: permissions.canDelete },
    ];

    const handleCreateCreator = () => {
        setEditingCreator(null);
        setFormOpen(true);
    };

    const handleEditCreator = (creator: Creator) => {
        setEditingCreator(creator);
        setFormOpen(true);
    };

    const handleDeleteCreator = (creator: Creator) => {
        setDeletingCreator(creator);
        setDeleteOpen(true);
    };

    const handleFormSubmit = async (data: { name: string; description?: string }) => {
        setFormLoading(true);
        try {
            let response;

            if (editingCreator) {
                const updateData: UpdateCreatorRequest = {
                    name: data.name,
                    description: data.description
                };
                response = await updateCreator(editingCreator.id, updateData);
                toast.success("Creator updated successfully");
            } else {
                const createData: CreateCreatorRequest = {
                    name: data.name,
                    description: data.description
                };
                response = await createCreator(createData);
                toast.success("Creator created successfully");
            }

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            // Update local state with new/updated creator
            if (editingCreator) {
                setCreators((prev) =>
                    prev.map((c) =>
                        c.id === editingCreator.id ? response.data : c,
                    ),
                );
            } else {
                setCreators((prev) => [...prev, response.data]);
            }

            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save creator:", error);
            if (error instanceof ApiError) {
                toast.error(
                    `${editingCreator ? "Failed to update" : "Failed to create"} creator: ${error.message}`,
                );
            } else {
                toast.error(
                    editingCreator
                        ? "Failed to update creator"
                        : "Failed to create creator",
                );
            }
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCreator) return;

        setDeleteLoading(true);
        try {
            const response = await deleteCreator(deletingCreator.id);

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            toast.success("Creator deleted successfully");

            // Update local state by removing deleted creator
            setCreators((prev) => prev.filter((c) => c.id !== deletingCreator.id));
            setDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete creator:", error);
            if (error instanceof ApiError) {
                toast.error(`Failed to delete creator: ${error.message}`);
            } else {
                toast.error("Failed to delete creator");
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
                        <div className="flex items-center gap-2 text-purple-600">
                            <Palette className="h-5 w-5" />
                            <span className="text-xs font-medium uppercase tracking-wide">
                                Master Data
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Creators
                            </h1>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                Quản lý thông tin tác giả, hoạ sĩ, studio và các vai trò sáng tạo khác.
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
                                onClick={handleCreateCreator}
                                size="sm"
                                className="sm:min-w-[160px]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm creator
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
                            master data creator.
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
                                            ? "border-purple-200 bg-purple-50 text-purple-600"
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
                            Danh sách creators
                        </CardTitle>
                        <CardDescription>
                            Thêm mới, cập nhật hoặc xoá các creator
                            trong hệ thống.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreatorsTable
                            data={creators}
                            session={session}
                            onEdit={handleEditCreator}
                            onDelete={handleDeleteCreator}
                        />
                    </CardContent>
                </Card>
            </section>

            {/* Dialogs */}
            <CreatorFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                creator={editingCreator}
                onSubmit={handleFormSubmit}
                isLoading={formLoading}
            />

            <DeleteConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Creator"
                description={`Are you sure you want to delete "${deletingCreator?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
            />
        </>
    );
}