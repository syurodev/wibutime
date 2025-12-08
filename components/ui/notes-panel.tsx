"use client";

import { NOTE_KEY } from "@/features/editor/components/plugins/note-plugin";
import { cn } from "@/lib/utils";
import { StickyNote, Trash2 } from "lucide-react";
import { useEditorRef, useEditorSelector } from "platejs/react";
import { Editor, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { Button } from "./button";

interface NotesPanelProps {
  className?: string;
}

interface NoteItem {
  id: string;
  text: string;
  noteText: string;
  path: number[];
}

export function NotesPanel({ className }: NotesPanelProps) {
  const editor = useEditorRef();

  // Lấy tất cả notes từ editor content
  const notes = useEditorSelector((editor) => {
    const noteList: NoteItem[] = [];
    let noteIndex = 0;

    // Duyệt qua tất cả text nodes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [node, path] of Editor.nodes(editor as any, {
      at: [],
      match: (n: any) =>
        Text.isText(n) && (n as any).note === true && (n as any).note_text,
    })) {
      const textNode = node as any;
      noteList.push({
        id: `note-${noteIndex++}`,
        text:
          textNode.text?.slice(0, 30) +
          (textNode.text?.length > 30 ? "..." : ""),
        noteText: textNode.note_text,
        path: path as number[],
      });
    }
    return noteList;
  }, []);

  const scrollToNote = (path: number[]) => {
    try {
      // Lấy parent element node (không phải text node)
      const parentPath = path.slice(0, -1);
      const node = Editor.node(editor as any, parentPath);
      if (node) {
        const [element] = node;
        const domNode = ReactEditor.toDOMNode(
          editor as unknown as ReactEditor,
          element as any
        );
        domNode?.scrollIntoView({ behavior: "smooth", block: "center" });

        // Select the note text
        const range = Editor.range(editor as any, path);
        Transforms.select(editor as any, range);
      }
    } catch (error) {
      console.error("Failed to scroll to note", error);
    }
  };

  const deleteNote = (path: number[]) => {
    try {
      const range = Editor.range(editor as any, path);
      Transforms.select(editor as any, range);
      editor.tf.removeMark(NOTE_KEY);
      editor.tf.removeMark("note_text");
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  return (
    <div
      className={cn(
        "w-48 p-3 h-full overflow-y-auto hidden xl:block",
        className
      )}
    >
      <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground flex items-center gap-2">
        <StickyNote className="size-4" />
        Ghi chú ({notes.length})
      </h3>
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group p-2 rounded-md hover:bg-muted/50 cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
          >
            <div
              className="flex items-start justify-between gap-2"
              onClick={() => scrollToNote(note.path)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-500 truncate">
                  {note.text}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.noteText}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.path);
                }}
              >
                <Trash2 className="size-3 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground italic px-2">
            Chưa có ghi chú nào
          </p>
        )}
      </div>
    </div>
  );
}
