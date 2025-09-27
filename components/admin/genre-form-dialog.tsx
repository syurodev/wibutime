"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Genre } from "@/lib/api/genres"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const genreSchema = z.object({
    name: z.string().min(1, "Genre name is required").max(100, "Genre name is too long"),
})

type GenreFormValues = z.infer<typeof genreSchema>

interface GenreFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    genre?: Genre | null
    onSubmit: (data: GenreFormValues) => Promise<void>
    isLoading?: boolean
}

export function GenreFormDialog({
    open,
    onOpenChange,
    genre,
    onSubmit,
    isLoading = false,
}: GenreFormDialogProps) {
    const isEditing = !!genre

    const form = useForm<GenreFormValues>({
        resolver: zodResolver(genreSchema),
        defaultValues: {
            name: "",
        },
    })

    // Reset form when genre changes or dialog opens/closes
    React.useEffect(() => {
        if (open) {
            form.reset({
                name: genre?.name || "",
            })
        }
    }, [open, genre, form])

    const handleSubmit = async (data: GenreFormValues) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in parent component
            console.error("Genre form submission failed:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Genre" : "Create New Genre"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the genre information."
                            : "Add a new genre to the system."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Genre Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter genre name..."
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}