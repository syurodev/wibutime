"use client";

import {
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { TextAlignPlugin } from "@platejs/basic-styles/react";
import { ParagraphPlugin, Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { ParagraphElement } from "@/components/ui/paragraph-node";
import { Toolbar } from "@/components/ui/toolbar";
import { editorNodeIdConfig } from "@/lib/editor/config";

import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

const PLUGINS = [
  ParagraphPlugin.withComponent(ParagraphElement),
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  TextAlignPlugin.configure({
    options: {
      defaultAlign: "left",
      types: [ParagraphPlugin.key, "h1", "h2", "h3", "h4", "h5", "h6"],
    },
  }),
];

interface BasicEditorProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function BasicEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  readOnly = false,
}: BasicEditorProps) {
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
        onChange?.(value);
      }}
    >
      <div className="w-full border rounded-md bg-background overflow-hidden">
        {!readOnly && (
          <Toolbar className="sticky top-0 z-50 w-full border-b bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex gap-2">
              <MarkToolbarButton
                nodeType={BoldPlugin.key}
                tooltip="Bold (Cmd+B)"
              >
                <Bold className="h-4 w-4" />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={ItalicPlugin.key}
                tooltip="Italic (Cmd+I)"
              >
                <Italic className="h-4 w-4" />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={UnderlinePlugin.key}
                tooltip="Underline (Cmd+U)"
              >
                <Underline className="h-4 w-4" />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={StrikethroughPlugin.key}
                tooltip="Strikethrough (Cmd+Shift+M)"
              >
                <Strikethrough className="h-4 w-4" />
              </MarkToolbarButton>

              <div className="w-px h-6 bg-border mx-1" />

              <AlignToolbarButton />
            </div>
          </Toolbar>
        )}

        <EditorContainer>
          <Editor
            placeholder={placeholder}
            variant="none"
            disabled={readOnly}
            className="min-h-[150px] max-h-[600px] overflow-y-auto px-3 py-2 focus-visible:ring-0"
          />
        </EditorContainer>
      </div>
    </Plate>
  );
}
