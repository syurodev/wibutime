"use client";

import { NavProvider } from "@/components/layout/nav/nav-context";
import { AuthProvider } from "@/components/providers/auth-provider";
import { UserSettingsProvider } from "@/components/providers/user-settings-provider";

/**
 * Client Providers Wrapper
 * Wraps children with client-side context providers
 * This component is used in locale layout to prevent re-mounting on navigation
 */
export function ClientProviders({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserSettingsProvider>
        <NavProvider>{children}</NavProvider>
      </UserSettingsProvider>
    </AuthProvider>
  );
}
