"use client";

import { setAuthToken } from "@/lib/api/auth-client";
import { useEffect } from "react";

interface SessionSyncProps {
  accessToken: string | null;
}

export function SessionSync({ accessToken }: SessionSyncProps) {
  useEffect(() => {
    // Hydrate the token into the client-side auth system
    console.log("[SessionSync] Hydrating token:", accessToken ? "Present" : "Null");
    if (accessToken) {
      setAuthToken(accessToken);
      console.log("[SessionSync] Token set in localStorage");
    }
  }, [accessToken]);

  return null;
}
