"use client"

import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { GenreFormDialog } from "@/components/admin/genre-form-dialog";
import { GenresTable } from "@/components/admin/genres-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth } from "@/lib/auth/auth";
import { GlobalPermission } from "@/lib/auth/constants";
import {
    getMasterDataPermissions,
    hasGlobalPermission,
} from "@/lib/auth/permissions";
import {
    createGenre,
    deleteGenre,
    getGenres,
    updateGenre,
    type Genre
} from "@/lib/api/genres";
import { ArrowLeft, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface GenresPageProps {
    params: Promise<{ locale: string }>;
}

export default function GenresPage({ params: paramsPromise }: GenresPageProps) {
    const { data: session } = useSession();
    const [params, setParams] = useState<{ locale: string } | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Resolve params
    useEffect(() => {
        paramsPromise.then(setParams);
    }, [paramsPromise]);

    // Check permissions
    useEffect(() => {
        if (params && session !== undefined) {
            if (!hasGlobalPermission(session, GlobalPermission.GENRE_VIEW)) {
                redirect(`/${params.locale}/auth/signin`);
            }
        }
    }, [session, params]);

    const userPermissions = getMasterDataPermissions(session, "GENRE");
    const canCreate = userPermissions.includes(GlobalPermission.GENRE_CREATE);
    const canUpdate = userPermissions.includes(GlobalPermission.GENRE_UPDATE);
    const canDelete = userPermissions.includes(GlobalPermission.GENRE_DELETE);

    // Load genres
    useEffect(() => {
        if (session && hasGlobalPermission(session, GlobalPermission.GENRE_VIEW)) {
            loadGenres();
        }
    }, [session]);

    const loadGenres = async () => {
        try {
            setLoading(true);
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.error("Failed to load genres:", error);
            toast.error("Failed to load genres");
        } finally {
            setLoading(false);
        }
    };

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
            if (editingGenre) {
                await updateGenre(editingGenre.id, data, session?.accessToken);
                toast.success("Genre updated successfully");
            } else {
                await createGenre(data, session?.accessToken);
                toast.success("Genre created successfully");
            }
            await loadGenres();
        } catch (error) {
            console.error("Failed to save genre:", error);
            toast.error(editingGenre ? "Failed to update genre" : "Failed to create genre");
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingGenre) return;

        setDeleteLoading(true);
        try {
            await deleteGenre(deletingGenre.id, session?.accessToken);
            toast.success("Genre deleted successfully");
            await loadGenres();
        } catch (error) {
            console.error("Failed to delete genre:", error);
            toast.error("Failed to delete genre");
            throw error; // Re-throw to prevent dialog from closing
        } finally {
            setDeleteLoading(false);
        }
    };

    if (!params) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container mx-auto py-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/system"
                                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to System
                            </Link>
                            <div className="flex items-center">
                                <Tag className="w-6 h-6 text-blue-600 mr-2" />
                                <h1 className="text-3xl font-bold">
                                    Genres Management
                                </h1>
                            </div>
                        </div>
                        {canCreate && (
                            <Button onClick={handleCreateGenre}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Genre
                            </Button>
                        )}
                    </div>

                    {/* Permissions Info */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Your Permissions:</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                View: ✓
                            </span>
                            <span
                                className={`px-2 py-1 rounded ${canCreate ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                            >
                                Create: {canCreate ? "✓" : "✗"}
                            </span>
                            <span
                                className={`px-2 py-1 rounded ${canUpdate ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                            >
                                Update: {canUpdate ? "✓" : "✗"}
                            </span>
                            <span
                                className={`px-2 py-1 rounded ${canDelete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                            >
                                Delete: {canDelete ? "✓" : "✗"}
                            </span>
                        </div>
                    </div>

                    {/* Genres Table */}
                    <div className="bg-card border rounded-lg p-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <GenresTable
                                data={genres}
                                session={session}
                                onEdit={handleEditGenre}
                                onDelete={handleDeleteGenre}
                            />
                        )}
                    </div>
                </div>
            </div>

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
