"use client";

import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { CharacterFormDialog } from "@/components/admin/character-form-dialog";
import { CharactersTable } from "@/components/admin/characters-table";
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
    createCharacter,
    deleteCharacter,
    Character,
    updateCharacter,
    type CreateCharacterRequest,
    type UpdateCharacterRequest,
} from "@/lib/api/characters/characters.api";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface CharactersManagementProps {
    initialCharacters: Character[];
    locale: string;
    permissions: {
        canView: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
}

export function CharactersManagement({
    initialCharacters,
    locale,
    permissions,
}: CharactersManagementProps) {
    const { data: session } = useSession();
    const [characters, setCharacters] = useState<Character[]>(initialCharacters);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const permissionBadges = [
        { label: "View", granted: permissions.canView },
        { label: "Create", granted: permissions.canCreate },
        { label: "Update", granted: permissions.canUpdate },
        { label: "Delete", granted: permissions.canDelete },
    ];

    const handleCreateCharacter = () => {
        setEditingCharacter(null);
        setFormOpen(true);
    };

    const handleEditCharacter = (character: Character) => {
        setEditingCharacter(character);
        setFormOpen(true);
    };

    const handleDeleteCharacter = (character: Character) => {
        setDeletingCharacter(character);
        setDeleteOpen(true);
    };

    const handleFormSubmit = async (data: { name: string; description?: string; image_url?: string }) => {
        setFormLoading(true);
        try {
            let response;

            if (editingCharacter) {
                const updateData: UpdateCharacterRequest = {
                    name: data.name,
                    description: data.description,
                    image_url: data.image_url
                };
                response = await updateCharacter(editingCharacter.id, updateData);
                toast.success("Character updated successfully");
            } else {
                const createData: CreateCharacterRequest = {
                    name: data.name,
                    description: data.description,
                    image_url: data.image_url
                };
                response = await createCharacter(createData);
                toast.success("Character created successfully");
            }

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            // Update local state with new/updated character
            if (editingCharacter) {
                setCharacters((prev) =>
                    prev.map((c) =>
                        c.id === editingCharacter.id ? response.data : c,
                    ),
                );
            } else {
                setCharacters((prev) => [...prev, response.data]);
            }

            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save character:", error);
            if (error instanceof ApiError) {
                toast.error(
                    `${editingCharacter ? "Failed to update" : "Failed to create"} character: ${error.message}`,
                );
            } else {
                toast.error(
                    editingCharacter
                        ? "Failed to update character"
                        : "Failed to create character",
                );
            }
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCharacter) return;

        setDeleteLoading(true);
        try {
            const response = await deleteCharacter(deletingCharacter.id);

            if (!response.success) {
                throw new Error(
                    response.error?.description || response.message,
                );
            }

            toast.success("Character deleted successfully");

            // Update local state by removing deleted character
            setCharacters((prev) => prev.filter((c) => c.id !== deletingCharacter.id));
            setDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete character:", error);
            if (error instanceof ApiError) {
                toast.error(`Failed to delete character: ${error.message}`);
            } else {
                toast.error("Failed to delete character");
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
                        <div className="flex items-center gap-2 text-emerald-600">
                            <Users className="h-5 w-5" />
                            <span className="text-xs font-medium uppercase tracking-wide">
                                Master Data
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Characters
                            </h1>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                Quản lý hồ sơ nhân vật, quan hệ và trạng thái phê duyệt trong toàn bộ hệ thống.
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
                                onClick={handleCreateCharacter}
                                size="sm"
                                className="sm:min-w-[160px]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm nhân vật
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
                            dữ liệu nhân vật.
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
                            Danh sách nhân vật
                        </CardTitle>
                        <CardDescription>
                            Thêm mới, cập nhật hoặc xoá các nhân vật
                            trong hệ thống.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CharactersTable
                            data={characters}
                            session={session}
                            onEdit={handleEditCharacter}
                            onDelete={handleDeleteCharacter}
                        />
                    </CardContent>
                </Card>
            </section>

            {/* Dialogs */}
            <CharacterFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                character={editingCharacter}
                onSubmit={handleFormSubmit}
                isLoading={formLoading}
            />

            <DeleteConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Character"
                description={`Are you sure you want to delete "${deletingCharacter?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
            />
        </>
    );
}