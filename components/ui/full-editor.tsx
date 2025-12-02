"use client";

import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { editorNodeIdConfig } from "@/lib/editor/config";

// Import Plugin Kits
import { AlignKit } from "@/features/editor/components/plugins/align-kit";
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
];

interface FullEditorProps {
  readonly value?: any;
  readonly onChange?: (value: any) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
}

export function FullEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  readOnly = false,
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
      <div className="w-full border rounded-md bg-background overflow-hidden flex flex-col h-[600px]">
        {!readOnly && <FixedToolbar />}

        <EditorContainer>
          <Editor
            placeholder={placeholder}
            variant="fullWidth"
            disabled={readOnly}
            className="flex-1 overflow-y-auto px-8 py-4 focus-visible:ring-0 min-h-[300px]"
          />
        </EditorContainer>
      </div>
    </Plate>
  );
}
