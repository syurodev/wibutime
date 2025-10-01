"use client"

import { DataTable } from "@/components/ui/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Character } from "@/lib/api/characters"

interface CharactersTableProps {
    data: Character[]
    session: Session | null
    onEdit?: (character: Character) => void
    onDelete?: (character: Character) => void
}

export function CharactersTable({ data, session, onEdit, onDelete }: CharactersTableProps) {
    const userPermissions = getMasterDataPermissions(session, "CHARACTER")
    const canUpdate = userPermissions.includes(GlobalPermission.CHARACTER_UPDATE)
    const canDelete = userPermissions.includes(GlobalPermission.CHARACTER_DELETE)

    const columns: ColumnDef<Character>[] = [
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
            header: "Character",
            cell: ({ row }) => {
                const character = row.original
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={character.image_url} alt={character.name} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                                {character.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{character.name}</div>
                    </div>
                )
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const character = row.original
                return (
                    <div className="max-w-[300px] text-sm text-muted-foreground">
                        {character.hasDescription ? character.getTruncatedDescription(80) : (
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
                const character = row.original
                return (
                    <div className="text-xs text-muted-foreground">
                        {character.formattedCreatedAt}
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const character = row.original

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
                                    onClick={() => onEdit?.(character)}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(character)}
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
            searchPlaceholder="Search characters..."
        />
    )
}