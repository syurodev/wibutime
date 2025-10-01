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
import { Creator } from "@/lib/api/creators"

interface CreatorsTableProps {
    data: Creator[]
    session: Session | null
    onEdit?: (creator: Creator) => void
    onDelete?: (creator: Creator) => void
}

export function CreatorsTable({ data, session, onEdit, onDelete }: CreatorsTableProps) {
    const userPermissions = getMasterDataPermissions(session, "CREATOR")
    const canUpdate = userPermissions.includes(GlobalPermission.CREATOR_UPDATE)
    const canDelete = userPermissions.includes(GlobalPermission.CREATOR_DELETE)

    const columns: ColumnDef<Creator>[] = [
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
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const creator = row.original
                return (
                    <div className="max-w-[300px] text-sm text-muted-foreground">
                        {creator.hasDescription ? creator.getTruncatedDescription(80) : (
                            <span className="italic">No description</span>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: "Created",
            cell: ({ row }) => {
                const creator = row.original
                return (
                    <div className="text-xs text-muted-foreground">
                        {creator.formattedCreatedAt}
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const creator = row.original

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
                                    onClick={() => onEdit?.(creator)}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(creator)}
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
            searchPlaceholder="Search creators..."
        />
    )
}