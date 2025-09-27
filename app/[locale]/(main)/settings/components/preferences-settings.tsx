"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
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
import { Badge } from "@/components/ui/badge";
import { GlobeIcon, PaletteIcon, BellIcon, BookOpenIcon, MonitorIcon, SunIcon, MoonIcon } from "lucide-react";
import { useRouter, usePathname } from "@/lib/i18n/navigation";

const preferencesSchema = z.object({
    language: z.string(),
    theme: z.enum(["light", "dark", "system"]),
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    newEpisodes: z.boolean(),
    newChapters: z.boolean(),
    releases: z.boolean(),
    reminders: z.boolean(),
    defaultView: z.enum(["list", "grid", "compact"]),
    adultContent: z.boolean(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

const themes = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: MonitorIcon },
];

export function PreferencesSettings() {
    const t = useTranslations("Common");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            language: locale,
            theme: (theme as "light" | "dark" | "system") || "system",
            emailNotifications: true,
            pushNotifications: true,
            newEpisodes: true,
            newChapters: true,
            releases: false,
            reminders: true,
            defaultView: "grid",
            adultContent: false,
        },
    });

    const onSubmit = async (data: PreferencesFormValues) => {
        setIsLoading(true);
        try {
            // Handle language change
            if (data.language !== locale) {
                router.replace(pathname, { locale: data.language });
            }

            // Handle theme change
            if (data.theme !== theme) {
                setTheme(data.theme);
            }

            // TODO: Save other preferences to backend
            console.log("Saving preferences:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Failed to save preferences:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentLanguage = languages.find(lang => lang.code === locale);

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Language Settings */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.preferences.language.title")}</CardTitle>
                                <CardDescription>{t("settings.preferences.language.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base">{t("settings.preferences.language.current")}</Label>
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <span>{currentLanguage?.flag}</span>
                                    <span>{currentLanguage?.name}</span>
                                </Badge>
                            </div>
                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((lang) => (
                                                        <SelectItem key={lang.code} value={lang.code}>
                                                            <div className="flex items-center space-x-2">
                                                                <span>{lang.flag}</span>
                                                                <span>{lang.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Theme Settings */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <PaletteIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.preferences.theme.title")}</CardTitle>
                                <CardDescription>{t("settings.preferences.theme.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="theme"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-3 gap-4"
                                            >
                                                {themes.map((themeOption) => (
                                                    <div key={themeOption.value}>
                                                        <RadioGroupItem
                                                            value={themeOption.value}
                                                            id={themeOption.value}
                                                            className="peer sr-only"
                                                        />
                                                        <Label
                                                            htmlFor={themeOption.value}
                                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                        >
                                                            <themeOption.icon className="mb-3 h-6 w-6" />
                                                            {t(`settings.preferences.theme.${themeOption.value}`)}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <BellIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.preferences.notifications.title")}</CardTitle>
                                <CardDescription>{t("settings.preferences.notifications.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="emailNotifications"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">{t("settings.preferences.notifications.email")}</FormLabel>
                                                <FormDescription>
                                                    Receive notifications via email
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
                                    name="pushNotifications"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">{t("settings.preferences.notifications.push")}</FormLabel>
                                                <FormDescription>
                                                    Receive push notifications
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
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Notification Types</h4>
                                <FormField
                                    control={form.control}
                                    name="newEpisodes"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm">{t("settings.preferences.notifications.newEpisodes")}</FormLabel>
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
                                    name="newChapters"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm">{t("settings.preferences.notifications.newChapters")}</FormLabel>
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
                                    name="releases"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm">{t("settings.preferences.notifications.releases")}</FormLabel>
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
                                    name="reminders"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm">{t("settings.preferences.notifications.reminders")}</FormLabel>
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Preferences */}
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                            <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle>{t("settings.preferences.content.title")}</CardTitle>
                                <CardDescription>{t("settings.preferences.content.description")}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="defaultView"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.preferences.content.defaultView")}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select default view" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="list">List View</SelectItem>
                                                <SelectItem value="grid">Grid View</SelectItem>
                                                <SelectItem value="compact">Compact View</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="adultContent"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">{t("settings.preferences.content.adultContent")}</FormLabel>
                                            <FormDescription>
                                                Show adult content in search results and recommendations
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