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
import { Creator } from "@/lib/api/creators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const creatorSchema = z.object({
    name: z.string().min(1, "Creator name is required").max(255, "Creator name is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
})

type CreatorFormValues = z.infer<typeof creatorSchema>

interface CreatorFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    creator?: Creator | null
    onSubmit: (data: CreatorFormValues) => Promise<void>
    isLoading?: boolean
}

export function CreatorFormDialog({
    open,
    onOpenChange,
    creator,
    onSubmit,
    isLoading = false,
}: CreatorFormDialogProps) {
    const isEditing = !!creator

    const form = useForm<CreatorFormValues>({
        resolver: zodResolver(creatorSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    // Reset form when creator changes or dialog opens/closes
    React.useEffect(() => {
        if (open) {
            form.reset({
                name: creator?.name || "",
                description: creator?.description || "",
            })
        }
    }, [open, creator, form])

    const handleSubmit = async (data: CreatorFormValues) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in parent component
            console.error("Creator form submission failed:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Creator" : "Create New Creator"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the creator information."
                            : "Add a new creator to the system."}
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
                                    <FormLabel>Creator Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter creator name..."
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
                                            placeholder="Enter creator description..."
                                            disabled={isLoading}
                                            rows={4}
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