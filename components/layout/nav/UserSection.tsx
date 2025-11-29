/**
 * User Section Component
 * Displays user info and actions in dropdown menu
 */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

interface UserSectionProps {
  /**
   * Callback when an action is clicked (to close dropdown)
   */
  readonly onActionClick?: () => void;
}

export function UserSection({ onActionClick }: UserSectionProps) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to OAuth login
    login("/");
    onActionClick?.();
  };

  const handleLogout = () => {
    logout();
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
    // TODO: If user has multiple tenants, show a selector
    // For now, navigate to a tenant selector or first tenant
    router.push("/workspace/demo-tenant"); // Replace with actual tenant selection
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
            <p className="font-medium text-sm">Not Signed In</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in to access your library
            </p>
          </div>
          <Button onClick={handleLogin} className="w-full" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
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
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
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

      {/* Workspace Links */}
      <div className="px-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleDashboard}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span className="text-sm">My Dashboard</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleWorkspace}
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">Team Workspace</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleAdmin}
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          <span className="text-sm">Admin Panel</span>
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Action Buttons */}
      <div className="px-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleViewProfile}
        >
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">View Profile</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2"
          onClick={handleSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">Settings</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start h-9 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
