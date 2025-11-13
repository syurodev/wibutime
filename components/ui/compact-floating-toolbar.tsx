'use client';

import * as React from 'react';

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from '@platejs/floating';
import { Bold, Italic, Underline } from 'lucide-react';
import { useEditorReadOnly, useEditorRef, useEditorSelector } from 'platejs/react';

import { MarkToolbarButton } from './mark-toolbar-button';
import { Toolbar } from './toolbar';

const floatingOptions: UseVirtualFloatingOptions = {
  middleware: [
    offset(8),
    flip({
      fallbackPlacements: ['top', 'bottom'],
      padding: 12,
    }),
  ],
  placement: 'top',
};

export function CompactFloatingToolbar() {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  const isSelectionExpanded = useEditorSelector(
    (editor) => {
      const { selection } = editor;
      if (!selection) return false;

      const [start, end] = [selection.anchor, selection.focus];
      return !(
        start.path.toString() === end.path.toString() &&
        start.offset === end.offset
      );
    },
    []
  );

  const state = useFloatingToolbarState({
    editorId: editor.id,
    floatingOptions,
    focusedEditorId: editor.id,
    hideToolbar: !isSelectionExpanded || readOnly,
  });

  const { hidden, props, ref } = useFloatingToolbar(state);

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
      </div>
    </Toolbar>
  );
}
