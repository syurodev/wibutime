"use client";

import * as React from "react";

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@platejs/floating";
import { Bold, Italic, StickyNote, Underline } from "lucide-react";
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
} from "platejs/react";

import { NOTE_KEY } from "@/features/editor/components/plugins/note-plugin";
import { Button } from "./button";
import { Input } from "./input";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Toolbar } from "./toolbar";

const floatingOptions: UseVirtualFloatingOptions = {
  middleware: [
    offset(8),
    flip({
      fallbackPlacements: ["top", "bottom"],
      padding: 12,
    }),
  ],
  placement: "top",
};

export function CompactFloatingToolbar() {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const [noteText, setNoteText] = React.useState("");
  const [isNotePopoverOpen, setIsNotePopoverOpen] = React.useState(false);

  const isSelectionExpanded = useEditorSelector((editor) => {
    const { selection } = editor;
    if (!selection) return false;

    const [start, end] = [selection.anchor, selection.focus];
    return !(
      start.path.toString() === end.path.toString() &&
      start.offset === end.offset
    );
  }, []);

  const state = useFloatingToolbarState({
    editorId: editor.id,
    floatingOptions,
    focusedEditorId: editor.id,
    hideToolbar: !isSelectionExpanded || readOnly,
  });

  const { hidden, props, ref } = useFloatingToolbar(state);

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    editor.tf.addMark(NOTE_KEY, true);
    editor.tf.addMark("note_text", noteText.trim());

    setNoteText("");
    setIsNotePopoverOpen(false);
  };

  if (hidden) return null;

  return (
    <Toolbar
      ref={ref}
      className="z-[60] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      {...props}
    >
      <div className="flex items-center gap-0.5">
        <MarkToolbarButton
          nodeType={BoldPlugin.key}
          tooltip="Bold (⌘B)"
          size="sm"
        >
          <Bold className="size-4" />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={ItalicPlugin.key}
          tooltip="Italic (⌘I)"
          size="sm"
        >
          <Italic className="size-4" />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={UnderlinePlugin.key}
          tooltip="Underline (⌘U)"
          size="sm"
        >
          <Underline className="size-4" />
        </MarkToolbarButton>

        <div className="mx-1 h-4 w-px bg-border" />

        <Popover open={isNotePopoverOpen} onOpenChange={setIsNotePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              title="Thêm ghi chú (⌘⇧N)"
            >
              <StickyNote className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" side="top" align="center">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Nhập nội dung ghi chú..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
              >
                Thêm ghi chú
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Toolbar>
  );
}
