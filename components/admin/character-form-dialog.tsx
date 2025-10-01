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
import { Textarea } from "@/components/ui/textarea"
import { Character } from "@/lib/api/characters"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const characterSchema = z.object({
    name: z.string().min(1, "Character name is required").max(255, "Character name is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type CharacterFormValues = z.infer<typeof characterSchema>

interface CharacterFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    character?: Character | null
    onSubmit: (data: CharacterFormValues) => Promise<void>
    isLoading?: boolean
}

export function CharacterFormDialog({
    open,
    onOpenChange,
    character,
    onSubmit,
    isLoading = false,
}: CharacterFormDialogProps) {
    const isEditing = !!character

    const form = useForm<CharacterFormValues>({
        resolver: zodResolver(characterSchema),
        defaultValues: {
            name: "",
            description: "",
            image_url: "",
        },
    })

    // Reset form when character changes or dialog opens/closes
    React.useEffect(() => {
        if (open) {
            form.reset({
                name: character?.name || "",
                description: character?.description || "",
                image_url: character?.image_url || "",
            })
        }
    }, [open, character, form])

    const handleSubmit = async (data: CharacterFormValues) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in parent component
            console.error("Character form submission failed:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Character" : "Create New Character"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the character information."
                            : "Add a new character to the system."}
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
                                    <FormLabel>Character Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter character name..."
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter character description..."
                                            disabled={isLoading}
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            disabled={isLoading}
                                            type="url"
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