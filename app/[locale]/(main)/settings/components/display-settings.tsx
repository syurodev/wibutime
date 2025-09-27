"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LayoutGridIcon, ListIcon, SlidersIcon, ArrowUpIcon, ArrowDownIcon, FilterIcon, EyeIcon, EyeOffIcon, PauseIcon } from "lucide-react";

const displaySchema = z.object({
    layoutMode: z.enum(["list", "grid", "compact"]),
    sortBy: z.enum(["title", "date", "rating", "progress", "status"]),
    sortOrder: z.enum(["asc", "desc"]),
    showCompleted: z.boolean(),
    showDropped: z.boolean(),
    showOnHold: z.boolean(),
    itemsPerPage: z.enum(["10", "25", "50", "100"]),
    showCoverImages: z.boolean(),
    showProgressBars: z.boolean(),
    showRatings: z.boolean(),
    compactMode: z.boolean(),
});

type DisplayFormValues = z.infer<typeof displaySchema>;

const layoutOptions = [
    {
        value: "list",
        label: "List View",
        description: "Traditional list layout with detailed information",
        icon: ListIcon,
    },
    {
        value: "grid",
        label: "Grid View",
        description: "Card-based grid layout with cover images",
        icon: LayoutGridIcon,
    },
    {
        value: "compact",
        label: "Compact View",
        description: "Dense layout showing more items at once",
        icon: SlidersIcon,
    },
];

const sortOptions = [
    { value: "title", label: "Title" },
    { value: "date", label: "Date Added" },
    { value: "rating", label: "Rating" },
    { value: "progress", label: "Progress" },
    { value: "status", label: "Status" },
];

const itemsPerPageOptions = [
    { value: "10", label: "10 items" },
    { value: "25", label: "25 items" },
    { value: "50", label: "50 items" },
    { value: "100", label: "100 items" },
];

export function DisplaySettings() {
    const t = useTranslations("Common");
    const tCommon = useTranslations("Common");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<DisplayFormValues>({
        resolver: zodResolver(displaySchema),
        defaultValues: {
            layoutMode: "grid",
            sortBy: "date",
            sortOrder: "desc",
            showCompleted: true,
            showDropped: false,
            showOnHold: true,
            itemsPerPage: "25",
            showCoverImages: true,
            showProgressBars: true,
            showRatings: true,
            compactMode: false,
        },
    });

    const onSubmit = async (data: DisplayFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Save display settings to backend/localStorage
            console.log("Saving display settings:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Failed to save display settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentLayout = form.watch("layoutMode");
    const currentSortOrder = form.watch("sortOrder");

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Layout Options */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <LayoutGridIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.display.layout.title")}</CardTitle>
                                <CardDescription>{t("settings.display.layout.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="layoutMode"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid gap-4"
                                            >
                                                {layoutOptions.map((option) => (
                                                    <div key={option.value}>
                                                        <RadioGroupItem
                                                            value={option.value}
                                                            id={option.value}
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor={option.value}
                                                            className="flex items-center space-x-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                                        >
                                                            <option.icon className="h-6 w-6" />
                                                            <div className="space-y-1">
                                                                <div className="font-medium">{option.label}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {option.description}
                                                                </div>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-6" />

                            {/* Items per page */}
                            <FormField
                                control={form.control}
                                name="itemsPerPage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Items per page</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select items per page" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {itemsPerPageOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Number of items to display per page
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Sorting Options */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <SlidersIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.display.sorting.title")}</CardTitle>
                                <CardDescription>{t("settings.display.sorting.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sortBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("settings.display.sorting.sortBy")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select sort criteria" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {sortOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sortOrder"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("settings.display.sorting.sortOrder")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select sort order" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="asc">
                                                        <div className="flex items-center space-x-2">
                                                            <ArrowUpIcon className="h-4 w-4" />
                                                            <span>{t("settings.display.sorting.ascending")}</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="desc">
                                                        <div className="flex items-center space-x-2">
                                                            <ArrowDownIcon className="h-4 w-4" />
                                                            <span>{t("settings.display.sorting.descending")}</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Filters */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <FilterIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.display.filters.title")}</CardTitle>
                                <CardDescription>{t("settings.display.filters.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="showCompleted"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center space-x-2">
                                                <EyeIcon className="h-4 w-4" />
                                                <span>{t("settings.display.filters.showCompleted")}</span>
                                            </FormLabel>
                                            <FormDescription>
                                                Show completed anime, manga, and novels in your lists
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="showDropped"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center space-x-2">
                                                <EyeOffIcon className="h-4 w-4" />
                                                <span>{t("settings.display.filters.showDropped")}</span>
                                            </FormLabel>
                                            <FormDescription>
                                                Show dropped items in your lists
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="showOnHold"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center space-x-2">
                                                <PauseIcon className="h-4 w-4" />
                                                <span>{t("settings.display.filters.showOnHold")}</span>
                                            </FormLabel>
                                            <FormDescription>
                                                Show on-hold items in your lists
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Visual Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visual Options</CardTitle>
                            <CardDescription>
                                Customize the visual appearance of your lists
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="showCoverImages"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show cover images</FormLabel>
                                            <FormDescription>
                                                Display cover art for anime, manga, and novels
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="showProgressBars"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show progress bars</FormLabel>
                                            <FormDescription>
                                                Display visual progress indicators
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="showRatings"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show ratings</FormLabel>
                                            <FormDescription>
                                                Display your personal ratings and scores
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="compactMode"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Compact mode</FormLabel>
                                            <FormDescription>
                                                Reduce spacing and padding for denser layouts
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? tCommon("loading") : tCommon("save")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}