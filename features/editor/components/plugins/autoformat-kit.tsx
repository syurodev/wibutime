"use client";

import { createPlatePlugin, PlateEditor } from "@platejs/core/react";
import { Editor, Range, Transforms } from "slate";

export const AutoformatPlugin = createPlatePlugin({
  key: "autoformat",
  handlers: {
    onKeyDown: ({
      editor,
      event,
    }: {
      editor: PlateEditor;
      event: React.KeyboardEvent;
    }) => {
      const { selection } = editor;
      if (!selection || !Range.isCollapsed(selection)) return;

      const slateEditor = editor as unknown as Editor;

      if (event.key === "-") {
        const { anchor } = selection;
        const before = Editor.before(slateEditor, anchor, {
          unit: "character",
        });
        if (before) {
          const range = { anchor: before, focus: anchor };
          const text = Editor.string(slateEditor, range);
          if (text === "-") {
            event.preventDefault();
            Transforms.select(slateEditor, range);
            Transforms.insertText(slateEditor, "—");
            return;
          }
        }
      }

      if (event.key === ".") {
        const { anchor } = selection;
        const before = Editor.before(slateEditor, anchor, {
          unit: "character",
          distance: 2,
        });
        if (before) {
          const range = { anchor: before, focus: anchor };
          const text = Editor.string(slateEditor, range);
          if (text === "..") {
            event.preventDefault();
            Transforms.select(slateEditor, range);
            Transforms.insertText(slateEditor, "…");
            return;
          }
        }
      }

      if (event.key === ">") {
        const { anchor } = selection;
        const before = Editor.before(slateEditor, anchor, {
          unit: "character",
        });
        if (before) {
          const range = { anchor: before, focus: anchor };
          const text = Editor.string(slateEditor, range);
          if (text === "-") {
            event.preventDefault();
            Transforms.select(slateEditor, range);
            Transforms.insertText(slateEditor, "→");
            return;
          }
        }
      }

      if (event.key === "<") {
        const { anchor } = selection;
        const before = Editor.before(slateEditor, anchor, {
          unit: "character",
        });
        if (before) {
          const range = { anchor: before, focus: anchor };
          const text = Editor.string(slateEditor, range);
          if (text === "-") {
            event.preventDefault();
            Transforms.select(slateEditor, range);
            Transforms.insertText(slateEditor, "←");
            return;
          }
        }
      }
    },
  },
});

export const AutoformatKit = [AutoformatPlugin];
