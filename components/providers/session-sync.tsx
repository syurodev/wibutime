"use client";

import { setAuthToken } from "@/lib/api/auth-client";
import { useEffect } from "react";

interface SessionSyncProps {
  accessToken: string | null;
}

export function SessionSync({ accessToken }: SessionSyncProps) {
  useEffect(() => {
    // Hydrate the token into the client-side auth system
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [accessToken]);

  return null;
}
