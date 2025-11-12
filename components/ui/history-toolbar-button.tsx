'use client';

import * as React from 'react';

import { useEditorRef } from 'platejs/react';
import { Redo, Undo } from 'lucide-react';

import { ToolbarButton } from './toolbar';

export function UndoToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      {...props}
      tooltip="Undo (⌘Z)"
      onClick={() => editor.undo()}
    >
      <Undo />
    </ToolbarButton>
  );
}

export function RedoToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      {...props}
      tooltip="Redo (⌘⇧Z)"
      onClick={() => editor.redo()}
    >
      <Redo />
    </ToolbarButton>
  );
}
