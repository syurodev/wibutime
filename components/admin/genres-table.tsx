"use client"

import { DataTable } from "@/components/ui/data-table"
import { GlobalPermission } from "@/lib/auth/constants"
import { getMasterDataPermissions } from "@/lib/auth/permissions"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Session } from "next-auth"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Genre } from "@/lib/api/genres"

interface GenresTableProps {
    data: Genre[]
    session: Session | null
    onEdit?: (genre: Genre) => void
    onDelete?: (genre: Genre) => void
}

export function GenresTable({ data, session, onEdit, onDelete }: GenresTableProps) {
    const userPermissions = getMasterDataPermissions(session, "GENRE")
    const canUpdate = userPermissions.includes(GlobalPermission.GENRE_UPDATE)
    const canDelete = userPermissions.includes(GlobalPermission.GENRE_DELETE)

    const columns: ColumnDef<Genre>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "anime_count",
            header: "Anime",
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {row.getValue("anime_count")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "manga_count",
            header: "Manga",
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        {row.getValue("manga_count")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "novel_count",
            header: "Novel",
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                        {row.getValue("novel_count")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div className="font-mono text-xs text-muted-foreground">
                    {row.getValue("id")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const genre = row.original

                if (!canUpdate && !canDelete) {
                    return null
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {canUpdate && (
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(genre)}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(genre)}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search genres..."
        />
    )
}