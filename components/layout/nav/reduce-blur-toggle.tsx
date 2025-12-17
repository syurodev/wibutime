/**
 * Glass Effect Toggle - For account menu
 * Horizontal layout with normal/reduce/liquid options
 */

"use client";

import type { GlassEffect } from "@/features/user/types";
import { useUiPreferences } from "@/hooks/use-user-settings";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Sparkles } from "lucide-react";

interface GlassEffectOption {
  value: GlassEffect;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export function GlassEffectToggle() {
  const { preferences, setGlassEffect } = useUiPreferences();

  const options: GlassEffectOption[] = [
    {
      value: "normal",
      icon: Eye,
      label: "Normal",
    },
    {
      value: "reduce",
      icon: EyeOff,
      label: "Reduce",
    },
    {
      value: "liquid",
      icon: Sparkles,
      label: "Liquid",
    },
  ];

  return (
    <div className="px-3 py-2 space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Glass Effect
      </label>
      <div className="flex gap-1">
        {options.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setGlassEffect(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              preferences.glass_effect === value
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-accent/80 text-accent-foreground"
            )}
            aria-label={`Set glass effect to ${label}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
