"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DatabaseIcon, ShieldCheckIcon, EyeIcon, MonitorIcon, SmartphoneIcon, TabletIcon, DownloadIcon, UploadIcon, TrashIcon } from "lucide-react";

const privacySchema = z.object({
    publicProfile: z.boolean(),
    showActivity: z.boolean(),
    showStats: z.boolean(),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

// Mock session data
const mockSessions = [
    {
        id: "current",
        device: "Chrome on Windows",
        location: "Ho Chi Minh City, Vietnam",
        lastActive: "Now",
        current: true,
        icon: MonitorIcon,
    },
    {
        id: "mobile-1",
        device: "Safari on iPhone",
        location: "Ho Chi Minh City, Vietnam",
        lastActive: "2 hours ago",
        current: false,
        icon: SmartphoneIcon,
    },
    {
        id: "tablet-1",
        device: "Chrome on iPad",
        location: "Hanoi, Vietnam",
        lastActive: "1 day ago",
        current: false,
        icon: TabletIcon,
    },
];

export function PrivacySettings() {
    const t = useTranslations("Common");
    const tCommon = useTranslations("Common");
    const [isLoading, setIsLoading] = useState(false);
    const [sessions, setSessions] = useState(mockSessions);

    const form = useForm<PrivacyFormValues>({
        resolver: zodResolver(privacySchema),
        defaultValues: {
            publicProfile: true,
            showActivity: false,
            showStats: true,
        },
    });

    const onSubmit = async (data: PrivacyFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Save privacy settings to backend
            console.log("Saving privacy settings:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Failed to save privacy settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportData = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement data export
            console.log("Exporting data...");

            // Simulate data export
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create a mock JSON file download
            const data = {
                profile: { name: "User", email: "user@example.com" },
                watchlist: [],
                readingList: [],
                preferences: {},
                exportDate: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wibutime-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportData = () => {
        // TODO: Implement data import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        console.log("Importing data:", data);
                        // Process imported data
                    } catch (error) {
                        console.error("Failed to parse imported data:", error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleRevokeSession = async (sessionId: string) => {
        setIsLoading(true);
        try {
            // TODO: Implement session revocation
            console.log("Revoking session:", sessionId);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Remove session from local state
            setSessions(sessions.filter(session => session.id !== sessionId));
        } catch (error) {
            console.error("Failed to revoke session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeAllSessions = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement revoking all sessions except current
            console.log("Revoking all other sessions...");

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Keep only current session
            setSessions(sessions.filter(session => session.current));
        } catch (error) {
            console.error("Failed to revoke all sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Data Management */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <DatabaseIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.privacy.dataManagement.title")}</CardTitle>
                        <CardDescription>{t("settings.privacy.dataManagement.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center space-x-2">
                                    <DownloadIcon className="h-4 w-4" />
                                    <span>{t("settings.privacy.dataManagement.exportData")}</span>
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {t("settings.privacy.dataManagement.exportDescription")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Button
                                    variant="outline"
                                    onClick={handleExportData}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <DownloadIcon className="h-4 w-4 mr-2" />
                                    {isLoading ? tCommon("loading") : t("settings.privacy.dataManagement.exportData")}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center space-x-2">
                                    <UploadIcon className="h-4 w-4" />
                                    <span>{t("settings.privacy.dataManagement.importData")}</span>
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {t("settings.privacy.dataManagement.importDescription")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Button
                                    variant="outline"
                                    onClick={handleImportData}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <UploadIcon className="h-4 w-4 mr-2" />
                                    {t("settings.privacy.dataManagement.importData")}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                        <CardTitle>{t("settings.privacy.sessions.title")}</CardTitle>
                        <CardDescription>{t("settings.privacy.sessions.description")}</CardDescription>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <TrashIcon className="h-4 w-4 mr-2" />
                                {t("settings.privacy.sessions.revokeAllSessions")}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("settings.privacy.sessions.revokeAllSessions")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will sign you out of all other devices. You will need to sign in again on those devices.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRevokeAllSessions}>
                                    {t("settings.privacy.sessions.revokeAllSessions")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>{t("settings.privacy.sessions.lastActive")}</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => {
                                const IconComponent = session.icon;
                                return (
                                    <TableRow key={session.id}>
                                        <TableCell className="flex items-center space-x-3">
                                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex items-center space-x-2">
                                                <span>{session.device}</span>
                                                {session.current && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {t("settings.privacy.sessions.currentSession")}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {session.location}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {session.lastActive}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {!session.current && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    disabled={isLoading}
                                                >
                                                    {t("settings.privacy.sessions.revokeSession")}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Profile Visibility */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <EyeIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.privacy.visibility.title")}</CardTitle>
                        <CardDescription>{t("settings.privacy.visibility.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="publicProfile"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">{t("settings.privacy.visibility.publicProfile")}</FormLabel>
                                            <FormDescription>
                                                Allow others to find and view your profile
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
                                name="showActivity"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">{t("settings.privacy.visibility.showActivity")}</FormLabel>
                                            <FormDescription>
                                                Show your recent watching and reading activity
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
                                name="showStats"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">{t("settings.privacy.visibility.showStats")}</FormLabel>
                                            <FormDescription>
                                                Display your watch time and reading statistics
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

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? tCommon("loading") : tCommon("save")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}