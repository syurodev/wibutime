'use client';

import * as React from 'react';
import { useEditorState } from 'platejs/react';
import type { TNode } from 'platejs';

interface WordCountProps {
  className?: string;
}

function extractText(nodes: TNode[]): string {
  return nodes
    .map((node) => {
      if ('text' in node) {
        return node.text;
      }
      if ('children' in node) {
        return extractText(node.children as TNode[]);
      }
      return '';
    })
    .join('');
}

export function WordCount({ className }: WordCountProps) {
  const editor = useEditorState();

  const stats = React.useMemo(() => {
    // Extract all text from editor nodes
    const text = extractText(editor.children as TNode[]);

    // Count words (split by whitespace and filter empty strings)
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Count characters (with spaces)
    const charactersWithSpaces = text.length;

    // Count characters (without spaces)
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
    };
  }, [editor.children]);

  return (
    <div className={className}>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="font-medium">{stats.words}</span>
          <span>words</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium">{stats.charactersWithoutSpaces}</span>
          <span>characters</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium">{stats.charactersWithSpaces}</span>
          <span>with spaces</span>
        </span>
      </div>
    </div>
  );
}
