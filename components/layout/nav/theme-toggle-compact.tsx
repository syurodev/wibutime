/**
 * Theme Toggle Compact - For dropdown menu
 * Horizontal layout with radio-style buttons
 */

"use client";

import { useTheme } from "@/hooks/use-user-settings";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: "light" as const,
      icon: Sun,
      label: "Light",
    },
    {
      value: "dark" as const,
      icon: Moon,
      label: "Dark",
    },
    {
      value: "system" as const,
      icon: Monitor,
      label: "System",
    },
  ];

  return (
    <div className="px-3 py-2 space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Theme
      </label>
      <div className="flex gap-1">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              theme === value
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-accent/80 text-accent-foreground"
            )}
            aria-label={`Set theme to ${label}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
