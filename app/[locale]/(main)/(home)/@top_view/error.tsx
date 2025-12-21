"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

/**
 * Error boundary for Top View section
 */
export default function TopViewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <p className="text-sm text-muted-foreground mb-1">
        Failed to load rankings
      </p>
      <p className="text-xs text-destructive/70 line-clamp-1 mb-3 max-w-full">
        {error.message}
      </p>
      <Button onClick={reset} variant="ghost" size="sm" className="gap-2">
        <RefreshCw className="h-3 w-3" />
        Retry
      </Button>
    </div>
  );
}
