"use client";

import {useState} from "react";
import {useSession} from "next-auth/react";
import {useTranslations} from "next-intl";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {CameraIcon, ShieldIcon, TrashIcon, UserIcon} from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const deleteAccountSchema = z.object({
    confirmation: z.string().refine((val) => val === "DELETE", {
        message: "Type 'DELETE' to confirm",
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export function AccountSettings() {
    const t = useTranslations("Common");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const deleteAccountForm = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountSchema),
    });

    const onUpdateProfile = async (data: ProfileFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Implement profile update API call
            console.log("Updating profile:", data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Profile update failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onChangePassword = async (data: PasswordFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Implement password change API call
            console.log("Changing password");
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            passwordForm.reset();
        } catch (error) {
            console.error("Password change failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDeleteAccount = async (data: DeleteAccountFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Implement account deletion API call
            console.log("Deleting account");
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Account deletion failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = () => {
        // TODO: Implement avatar upload functionality
        console.log("Opening avatar upload dialog");
    };

    const handleRemoveAvatar = () => {
        // TODO: Implement avatar removal
        console.log("Removing avatar");
    };

    const toggleTwoFactor = () => {
        // TODO: Implement 2FA toggle
        setTwoFactorEnabled(!twoFactorEnabled);
    };

    return (
        <div className="space-y-8">
            {/* Profile Information Section */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.account.profile.title")}</CardTitle>
                        <CardDescription>{t("settings.account.profile.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                            <AvatarFallback className="text-lg">
                                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                                <CameraIcon className="h-4 w-4 mr-2" />
                                {t("settings.account.profile.changeAvatar")}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleRemoveAvatar}>
                                {t("settings.account.profile.removeAvatar")}
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.account.profile.name")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your display name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.account.profile.email")}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? tCommon("loading") : tCommon("save")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>{t("settings.account.security.title")}</CardTitle>
                        <CardDescription>{t("settings.account.security.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">{t("settings.account.security.twoFactor")}</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {twoFactorEnabled && (
                                <Badge variant="secondary" className="mr-2">Enabled</Badge>
                            )}
                            <Switch
                                checked={twoFactorEnabled}
                                onCheckedChange={toggleTwoFactor}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Password Change Form */}
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.account.security.currentPassword")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter current password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.account.security.newPassword")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("settings.account.security.confirmPassword")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? tCommon("loading") : t("settings.account.security.changePassword")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                    <TrashIcon className="h-5 w-5 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">{t("settings.account.danger.title")}</CardTitle>
                        <CardDescription>{t("settings.account.danger.description")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <TrashIcon className="h-4 w-4 mr-2" />
                                {t("settings.account.danger.deleteAccount")}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("settings.account.danger.deleteAccount")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("settings.account.danger.deleteAccountDescription")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Form {...deleteAccountForm}>
                                <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccount)} className="space-y-4">
                                    <FormField
                                        control={deleteAccountForm.control}
                                        name="confirmation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("settings.account.danger.deleteConfirmation")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="DELETE" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                                        <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            {isLoading ? tCommon("loading") : t("settings.account.danger.deleteAccount")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </form>
                            </Form>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}