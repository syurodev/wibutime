/**
 * User Section Component
 * Displays user info and actions in dropdown menu
 */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  SettingsIcon,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface UserSectionProps {
  /**
   * Callback when an action is clicked (to close dropdown)
   */
  readonly onActionClick?: () => void;
}

export function UserSection({ onActionClick }: UserSectionProps) {
  const { user, isLoggedIn, login, logout, isAdmin } = useAuth();
  const router = useRouter();
  const t = useTranslations("navigation.userSection");

  const handleLogin = () => {
    // Redirect to OAuth login
    login("/");
    onActionClick?.();
  };

  const handleLogout = () => {
    logout();
    onActionClick?.();
  };

  const handleAccountSettings = () => {
    router.push("/account");
    onActionClick?.();
  };

  const handleViewProfile = () => {
    router.push("/profile");
    onActionClick?.();
  };

  const handleSettings = () => {
    router.push("/settings");
    onActionClick?.();
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    onActionClick?.();
  };

  const handleWorkspace = () => {
    // Navigate to organizations list
    router.push("/organizations");
    onActionClick?.();
  };

  const handleAdmin = () => {
    router.push("/admin");
    onActionClick?.();
  };

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="p-3">
        <div className="space-y-3 p-3 bg-accent/30 rounded-lg text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">{t("notSignedIn")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("signInDescription")}
            </p>
          </div>
          <Button onClick={handleLogin} className="w-full" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            {t("signIn")}
          </Button>
        </div>
      </div>
    );
  }

  // Logged in state
  if (!user) return null; // Safety check

  return (
    <div className="space-y-1">
      {/* User Info Header */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getImageUrl(user.image)} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleAccountSettings}
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("accountSettings")}</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleViewProfile}
        >
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("viewProfile")}</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("settings")}</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("signOut")}</span>
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Workspace Links */}
      <div className="px-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleDashboard}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("myDashboard")}</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleWorkspace}
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">{t("organizations")}</span>
        </Button>

        {isAdmin && (
          <Button
            variant="ghost"
            className="w-full justify-start h-9 px-2"
            onClick={handleAdmin}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            <span className="text-sm">{t("adminPanel")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
