"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StickyNote, Trash2 } from "lucide-react";
import {
  createPlatePlugin,
  PlateLeaf,
  type PlateLeafProps,
  useEditorRef,
} from "platejs/react";
import { useCallback, useRef, useState } from "react";
import { Editor, Text, Transforms } from "slate";

// Plugin key
export const NOTE_KEY = "note";

// Node type for note mark
export interface NoteText {
  note?: boolean;
  note_text?: string;
}

// Create note plugin
export const NotePlugin = createPlatePlugin({
  key: NOTE_KEY,
  node: {
    isLeaf: true,
    component: NoteLeaf,
  },
}).extend({
  shortcuts: {
    toggle: {
      keys: "mod+shift+n",
    },
  },
});

// NoteLeaf component với icon để edit
export function NoteLeaf(props: PlateLeafProps) {
  const editor = useEditorRef();
  const noteText = props.leaf.note_text as string | undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [editText, setEditText] = useState(noteText || "");
  const leafTextRef = useRef(props.leaf.text as string);

  // Tìm và select leaf node có text matching
  const selectMatchingLeaf = useCallback(() => {
    const targetText = leafTextRef.current;
    console.log("[NotePlugin] selectMatchingLeaf - looking for:", targetText);

    // Tìm tất cả text nodes có note mark và text matching
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [match] = Editor.nodes(editor as any, {
      at: [],
      match: (n: any) =>
        Text.isText(n) && (n as any).note === true && n.text === targetText,
    });

    if (match) {
      const [, path] = match;
      console.log("[NotePlugin] selectMatchingLeaf - found at path:", path);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const range = Editor.range(editor as any, path);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Transforms.select(editor as any, range);
      return true;
    }
    console.log("[NotePlugin] selectMatchingLeaf - NOT FOUND");
    return false;
  }, [editor]);

  const handleSave = () => {
    if (selectMatchingLeaf()) {
      if (editText.trim()) {
        editor.tf.addMark("note_text", editText.trim());
      } else {
        editor.tf.removeMark(NOTE_KEY);
        editor.tf.removeMark("note_text");
      }
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("[NotePlugin] handleDelete called");
    if (selectMatchingLeaf()) {
      console.log("[NotePlugin] handleDelete - removing marks");
      editor.tf.removeMark(NOTE_KEY);
      editor.tf.removeMark("note_text");
    }
    setIsOpen(false);
  };

  return (
    <span className="relative inline group/note">
      <PlateLeaf
        {...props}
        as="span"
        className={cn(
          "underline decoration-amber-500 decoration-2",
          "text-inherit transition-colors",
          "group-hover/note:bg-amber-100 dark:group-hover/note:bg-amber-900/30"
        )}
      >
        {props.children}
      </PlateLeaf>
      {/* Icon nhỏ để click edit */}
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) setEditText(noteText || "");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center size-4 ml-0.5 align-middle text-amber-600 hover:text-amber-700 rounded cursor-pointer"
            contentEditable={false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <StickyNote className="size-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" side="top" align="center">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Nội dung ghi chú..."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave} className="flex-1">
                Lưu
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
}
