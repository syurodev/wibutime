"use client";

import { NavProvider } from "@/components/layout/nav/NavContext";
import { UserSettingsProvider } from "@/components/providers/UserSettingsProvider";

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
    <UserSettingsProvider>
      <NavProvider>{children}</NavProvider>
    </UserSettingsProvider>
  );
}
