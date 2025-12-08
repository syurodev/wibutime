"use client";

import { Plate, usePlateEditor } from "platejs/react";

import { Button } from "@/components/ui/button";
import { CompactFloatingToolbar } from "@/components/ui/compact-floating-toolbar";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { EditorStats } from "@/components/ui/editor-stats";
import { FindReplaceToolbar } from "@/components/ui/find-replace-toolbar";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { NotesPanel } from "@/components/ui/notes-panel";
import { SideNotes } from "@/components/ui/side-notes";
import { useBooleanQueryState } from "@/hooks/use-query-state";
import { useTypewriterScroll } from "@/hooks/use-typewriter-scroll";
import { editorNodeIdConfig } from "@/lib/editor/config";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Import Plugin Kits
import { AlignKit } from "@/features/editor/components/plugins/align-kit";
import { AutoformatKit } from "@/features/editor/components/plugins/autoformat-kit";
import { BasicBlocksKit } from "@/features/editor/components/plugins/basic-blocks-kit";
import { BasicMarksKit } from "@/features/editor/components/plugins/basic-marks-kit";
import { IndentKit } from "@/features/editor/components/plugins/indent-kit";
import { LinkKit } from "@/features/editor/components/plugins/link-kit";
import { MediaKit } from "@/features/editor/components/plugins/media-kit";

const PLUGINS = [
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...AlignKit,
  ...IndentKit,
  ...LinkKit,
  ...MediaKit,
  ...AutoformatKit,
];

// Export để reuse trong translation-editor
export const FULL_EDITOR_PLUGINS = PLUGINS;

interface FullEditorProps {
  readonly value?: any;
  readonly onChange?: (value: any) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
  readonly novelId?: string;
}

export function FullEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  readOnly = false,
  novelId,
}: FullEditorProps) {
  const editor = usePlateEditor({
    plugins: PLUGINS,
    value: value || [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ],
    nodeId: editorNodeIdConfig,
  });

  return (
    <Plate
      editor={editor}
      onValueChange={({ value }) => {
        // Ensure there's always at least one paragraph node
        // This prevents editor from becoming locked when all content is deleted
        const normalizedValue =
          !value || value.length === 0
            ? [{ type: "p", children: [{ text: "" }] }]
            : value;

        onChange?.(normalizedValue);
      }}
    >
      <FullEditorContent
        readOnly={readOnly}
        placeholder={placeholder}
        novelId={novelId}
      />
    </Plate>
  );
}

function FullEditorContent({
  readOnly,
  placeholder,
  novelId,
}: {
  readonly readOnly: boolean;
  readonly placeholder: string;
  readonly novelId?: string;
}) {
  const [isZenMode, setIsZenMode] = useBooleanQueryState("zen", false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useTypewriterScroll({
    enabled: isZenMode,
    containerRef: containerRef as React.RefObject<HTMLElement>,
    offset: 0.4,
  });

  // Keyboard shortcut for Find & Replace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setIsFindReplaceOpen((prev) => !prev);
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);
    return () =>
      globalThis.window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "w-full border rounded-md bg-background overflow-hidden flex flex-col transition-all duration-300 relative",
        isZenMode ? "fixed inset-0 z-50 h-screen border-0" : "h-[600px]"
      )}
    >
      <div className="flex items-center border-b bg-background px-2">
        {!readOnly && <FixedToolbar />}
        <div className="ml-auto pl-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFindReplaceOpen(!isFindReplaceOpen)}
            title="Find & Replace (Cmd+F)"
            className={cn(isFindReplaceOpen && "bg-muted")}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsZenMode(!isZenMode)}
            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
          >
            {isZenMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <FindReplaceToolbar
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
      />

      <CompactFloatingToolbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Notes Panel - Hide in Zen Mode */}
        {!isZenMode && !readOnly && (
          <NotesPanel className="border-r bg-background/50 backdrop-blur-sm" />
        )}

        <EditorContainer
          ref={containerRef}
          className={cn(
            "flex-1 overflow-y-auto",
            isZenMode && "max-w-5xl mx-auto px-8 py-12"
          )}
        >
          <Editor
            placeholder={placeholder}
            variant={isZenMode ? "default" : "fullWidth"}
            disabled={readOnly}
            className={cn(
              "flex-1 focus-visible:ring-0 min-h-[300px]",
              isZenMode ? "px-0" : "px-8 py-4"
            )}
          />
        </EditorContainer>
      </div>

      <div className="border-t bg-background/95 p-2 px-4 flex justify-end">
        <EditorStats />
      </div>

      {/* Side Notes - Only show if novelId is provided and not readOnly */}
      {novelId && !readOnly && (
        <SideNotes
          novelId={novelId}
          className={
            isZenMode ? "fixed top-20 right-0" : "absolute top-20 right-0"
          }
        />
      )}
    </div>
  );
}
