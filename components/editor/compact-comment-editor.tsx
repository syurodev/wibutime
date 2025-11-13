"use client";

import * as React from "react";

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { X } from "lucide-react";
import type { TNode } from "platejs";
import { ParagraphPlugin, Plate, usePlateEditor } from "platejs/react";

import { Button } from "@/components/ui/button";
import { CompactFloatingToolbar } from "@/components/ui/compact-floating-toolbar";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { ParagraphElement } from "@/components/ui/paragraph-node";

const PLUGINS = [
  ParagraphPlugin.withComponent(ParagraphElement),
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
];

const INITIAL_VALUE: TNode[] = [
  {
    id: "1",
    type: "p",
    children: [{ text: "" }],
  },
];

export interface CompactCommentEditorProps {
  /**
   * Callback when user submits the comment
   */
  onSubmit: (content: TNode[]) => void;

  /**
   * Callback when user cancels
   */
  onCancel: () => void;

  /**
   * Placeholder text
   * @default "Write a comment..."
   */
  placeholder?: string;

  /**
   * Initial value
   */
  initialValue?: TNode[];

  /**
   * Auto focus editor on mount
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Submit button text
   * @default "Post"
   */
  submitText?: string;

  /**
   * Cancel button text
   * @default "Cancel"
   */
  cancelText?: string;
}

export function CompactCommentEditor({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  initialValue = INITIAL_VALUE,
  autoFocus = true,
  submitText = "Post",
  cancelText = "Cancel",
}: CompactCommentEditorProps) {
  const editor = usePlateEditor({
    plugins: PLUGINS,
    value: initialValue as any,
  });

  const handleSubmit = React.useCallback(() => {
    if (editor && editor.children) {
      // Check if content is not empty
      const hasContent = editor.children.some((node: any) => {
        if ("text" in node) return node.text.trim().length > 0;
        if ("children" in node) {
          return node.children.some((child: any) => {
            return "text" in child && child.text.trim().length > 0;
          });
        }
        return false;
      });

      if (hasContent) {
        onSubmit(editor.children as TNode[]);
      }
    }
  }, [editor, onSubmit]);

  const handleCancel = React.useCallback(() => {
    onCancel();
  }, [onCancel]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Submit on Ctrl/Cmd + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      // Cancel on Escape
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, handleCancel]);

  return (
    <Plate editor={editor}>
      <div className="flex w-full flex-col gap-2">
        {/* Editor Container */}
        <EditorContainer variant="comment" className="relative">
          <Editor
            variant="comment"
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="min-h-[80px] max-h-[200px] overflow-y-auto"
          />

          {/* Floating Toolbar */}
          <CompactFloatingToolbar />
        </EditorContainer>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>↵
            </kbd>{" "}
            to submit •{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              Esc
            </kbd>{" "}
            to cancel
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8"
            >
              <X className="mr-1 size-3.5" />
              {cancelText}
            </Button>

            <Button size="sm" onClick={handleSubmit} className="h-8">
              {submitText}
            </Button>
          </div>
        </div>
      </div>
    </Plate>
  );
}
