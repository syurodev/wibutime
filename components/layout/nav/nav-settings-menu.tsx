"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUiPreferences } from "@/hooks/use-user-settings";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignJustify, AlignLeft, X } from "lucide-react";

export interface NavSettingsMenuContentProps {
  readonly onClose: () => void;
}

export function NavSettingsMenuContent({
  onClose,
}: NavSettingsMenuContentProps) {
  const { preferences, updatePreferences } = useUiPreferences();

  // Helper to update font family
  const handleFontChange = (value: string) => {
    updatePreferences({ ...preferences, font_family: value });
  };

  // Helper to update font size
  const handleFontSizeChange = (value: number[]) => {
    updatePreferences({ ...preferences, font_size: value[0] });
  };

  // Helper to update text align
  const handleTextAlignChange = (value: string) => {
    if (value) {
      updatePreferences({
        ...preferences,
        text_align: value as "left" | "center" | "justify",
      });
    }
  };

  return (
    <div className="w-full space-y-4 p-2">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Reading Settings</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Typeface
          </Label>
          <ToggleGroup
            type="single"
            value={preferences.font_family || "sans"}
            onValueChange={handleFontChange}
            className="justify-start gap-2"
          >
            <ToggleGroupItem
              value="sans"
              aria-label="Sans Serif"
              className="font-sans"
            >
              Sans
            </ToggleGroupItem>
            <ToggleGroupItem
              value="serif"
              aria-label="Serif"
              className="font-serif"
            >
              Serif
            </ToggleGroupItem>
            <ToggleGroupItem
              value="mono"
              aria-label="Monospace"
              className="font-mono"
            >
              Mono
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">
              Font Size
            </Label>
            <span className="text-xs">{preferences.font_size || 16}px</span>
          </div>
          <Slider
            defaultValue={[preferences.font_size || 16]}
            max={32}
            min={12}
            step={1}
            onValueChange={handleFontSizeChange}
          />
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Theme
          </Label>
          <div className="flex items-center gap-2">
            {[
              {
                id: "group_system",
                label: "System",
                bg: "bg-background",
                border: "border-border",
              },
              {
                id: "light",
                label: "Light",
                bg: "bg-[#ffffff]",
                border: "border-gray-200",
              },
              {
                id: "sepia",
                label: "Sepia",
                bg: "bg-[#f4ecd8]",
                border: "border-[#e0d7c0]",
              },
              {
                id: "dark",
                label: "Dark",
                bg: "bg-[#1f1f1f]",
                border: "border-gray-700",
              },
              {
                id: "black",
                label: "Black",
                bg: "bg-[#000000]",
                border: "border-gray-800",
              },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() =>
                  updatePreferences({
                    reading_theme: theme.id as any,
                  })
                }
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  theme.bg,
                  theme.border,
                  preferences.reading_theme === theme.id
                    ? "ring-2 ring-primary ring-offset-2 border-primary"
                    : ""
                )}
                title={theme.label}
                aria-label={`Select ${theme.label} theme`}
              />
            ))}
          </div>
        </div>

        {/* Text Align */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Alignment
          </Label>
          <ToggleGroup
            type="single"
            value={preferences.text_align || "left"}
            onValueChange={handleTextAlignChange}
            className="justify-start"
          >
            <ToggleGroupItem value="left" aria-label="Left Align">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify" aria-label="Justify">
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center Align">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
