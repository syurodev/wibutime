"use client";

import { Button } from "@/components/ui/button";
import { revokeUserSession } from "@/features/user/actions";
import { UserSessions } from "@/features/user/types";
import { Laptop, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SessionListProps {
  initialSessions: UserSessions;
}

export function SessionList({ initialSessions }: SessionListProps) {
  const t = useTranslations("account.security.sessions");
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleRevoke(id: string) {
    setRevokingId(id);
    try {
      await revokeUserSession(id);
      toast.success(t("revoke_success"));
      router.refresh(); // Refresh server component data
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setRevokingId(null);
    }
  }

  const sessions = initialSessions || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-full">
                {/* Simple device icon logic */}
                {session.device.toLowerCase().includes("mobile") ||
                session.device.toLowerCase().includes("phone") ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {session.client_os} • {session.browser}
                  {session.current && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">
                      {t("current")}
                    </span>
                  )}
                </p>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>{session.ip}</span>
                  <span>•</span>
                  <span>
                    {t("last_active")}:{" "}
                    {new Date(session.last_active).toLocaleString()}
                    {/* or use date-fns: formatDistanceToNow(new Date(session.last_active)) */}
                  </span>
                </div>
              </div>
            </div>

            {!session.current && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRevoke(session.id)}
                disabled={revokingId === session.id}
              >
                {revokingId === session.id ? "Revoking..." : t("revoke")}
              </Button>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <p className="text-muted-foreground">No active sessions found.</p>
        )}
      </div>
    </div>
  );
}
