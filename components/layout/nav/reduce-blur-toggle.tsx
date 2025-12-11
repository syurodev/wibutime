/**
 * Reduce Blur Toggle - For account menu
 * Horizontal layout with on/off buttons
 */

"use client";

import { useUiPreferences } from "@/lib/hooks/use-user-settings";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReduceBlurToggle() {
  const { preferences, setReduceBlur } = useUiPreferences();

  const options = [
    {
      value: false,
      icon: Eye,
      label: "Normal",
    },
    {
      value: true,
      icon: EyeOff,
      label: "Reduce",
    },
  ];

  return (
    <div className="px-3 py-2 space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Blur Effect
      </label>
      <div className="flex gap-1">
        {options.map(({ value, icon: Icon, label }) => (
          <button
            key={String(value)}
            onClick={() => setReduceBlur(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              preferences.reduce_blur === value
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-accent/80 text-accent-foreground"
            )}
            aria-label={`Set blur to ${label}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
