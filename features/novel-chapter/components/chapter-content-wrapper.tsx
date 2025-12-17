"use client";

import type { StaticEditorViewProps } from "@/features/editor/components/static-editor-view";
import { StaticEditorView } from "@/features/editor/components/static-editor-view";
import { useUiPreferences } from "@/hooks/use-user-settings";

export function ChapterContentWrapper(props: StaticEditorViewProps) {
  const { preferences } = useUiPreferences();

  // Map preferences to styles
  const fontFamilyValue =
    preferences.font_family === "serif"
      ? "var(--font-serif)"
      : preferences.font_family === "mono"
      ? "var(--font-mono)"
      : "var(--font-sans)";

  // Map theme to styles
  const getThemeStyles = () => {
    switch (preferences.reading_theme) {
      case "light":
        return {
          backgroundColor: "#ffffff",
          color: "#333333",
        };
      case "sepia":
        return {
          backgroundColor: "#f4ecd8",
          color: "#5b4636",
        };
      case "dark":
        return {
          backgroundColor: "#1f1f1f",
          color: "#d1d1d1",
        };
      case "black":
        return {
          backgroundColor: "#000000",
          color: "#a6a6a6",
        };
      case "group_system":
      default:
        return undefined; // Use default inherited styles (bg-card etc)
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      className="bg-card rounded-xl border shadow-xs p-6 sm:p-10 min-h-[500px] transition-colors duration-300"
      style={themeStyles}
    >
      <StaticEditorView
        {...props}
        fontFamily={fontFamilyValue}
        variant="fullWidth"
        style={{
          fontSize: preferences.font_size
            ? `${preferences.font_size}px`
            : undefined,
          textAlign: preferences.text_align,
          color: "inherit", // Ensure text color inherits from container
        }}
      />
    </div>
  );
}
