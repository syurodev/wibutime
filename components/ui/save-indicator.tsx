"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface SaveIndicatorProps {
  status: "saved" | "saving" | "unsaved" | "error";
  lastSaved: Date | null;
  className?: string;
}

export function SaveIndicator({
  status,
  lastSaved,
  className,
}: SaveIndicatorProps) {
  const statusConfig = {
    saved: {
      text: "Saved",
      className: "text-green-600 dark:text-green-500",
    },
    saving: {
      text: "Saving...",
      className: "text-yellow-600 dark:text-yellow-500",
    },
    unsaved: {
      text: "Unsaved changes",
      className: "text-orange-600 dark:text-orange-500",
    },
    error: {
      text: "Save failed",
      className: "text-red-600 dark:text-red-500",
    },
  };

  const config = statusConfig[status];

  const [currentTime, setCurrentTime] = React.useState(() => Date.now());

  // Update current time every 30 seconds for time ago calculation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const timeAgo = React.useMemo(() => {
    if (!lastSaved) return "";
    const seconds = Math.floor((currentTime - lastSaved.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }, [lastSaved, currentTime]);

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className={config.className}>{config.text}</span>
      {lastSaved && status === "saved" && (
        <span className="text-muted-foreground">• {timeAgo}</span>
      )}
    </div>
  );
}
