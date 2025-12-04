"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useEditorRef } from "platejs/react";
import { useCallback, useEffect, useState } from "react";
import { BasePoint, Editor, NodeEntry, Path, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";

interface FindReplaceToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface Match {
  path: Path;
  anchor: BasePoint;
  focus: BasePoint;
}

export function FindReplaceToolbar({
  isOpen,
  onClose,
  className,
}: FindReplaceToolbarProps) {
  const editor = useEditorRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  // Search function
  const search = useCallback(() => {
    if (!searchTerm) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const newMatches: Match[] = [];
    const nodes = Array.from(
      (editor as any).nodes({
        at: [],
        match: (n: any) => Text.isText(n),
      })
    );

    nodes.forEach((entry) => {
      const [node, path] = entry as NodeEntry<Text>;
      if (Text.isText(node)) {
        const text = node.text;
        let match;
        const regex = new RegExp(searchTerm, "gi");
        while ((match = regex.exec(text)) !== null) {
          newMatches.push({
            path,
            anchor: { path, offset: match.index },
            focus: { path, offset: match.index + searchTerm.length },
          });
        }
      }
    });

    setMatches(newMatches);
    if (newMatches.length > 0) {
      setCurrentMatchIndex(0);
      selectMatch(newMatches[0]);
    } else {
      setCurrentMatchIndex(-1);
    }
  }, [editor, searchTerm]);

  // Select a match
  const selectMatch = (match: Match) => {
    Transforms.select(editor as unknown as Editor, {
      anchor: match.anchor,
      focus: match.focus,
    });

    // Scroll to view
    try {
      // We rely on default behavior of selection to scroll into view
      // If needed, we can use ReactEditor.toDOMNode but it requires casting
      const domNode = ReactEditor.toDOMNode(
        editor as unknown as ReactEditor,
        editor
      );
      if (domNode) {
        // Optional: custom scroll logic if needed
      }
    } catch (e) {
      // Ignore errors if DOM node not found
    }
  };

  // Navigation
  const nextMatch = () => {
    if (matches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    selectMatch(matches[nextIndex]);
  };

  const prevMatch = () => {
    if (matches.length === 0) return;
    const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIndex);
    selectMatch(matches[prevIndex]);
  };

  // Replace
  const replace = () => {
    if (currentMatchIndex === -1 || matches.length === 0) return;

    const match = matches[currentMatchIndex];

    Transforms.insertText(editor as unknown as Editor, replaceTerm, {
      at: {
        anchor: match.anchor,
        focus: match.focus,
      },
    });

    setTimeout(search, 0);
  };

  const replaceAll = () => {
    if (!searchTerm) return;

    const reversedMatches = [...matches].reverse();

    reversedMatches.forEach((match) => {
      Transforms.insertText(editor as unknown as Editor, replaceTerm, {
        at: {
          anchor: match.anchor,
          focus: match.focus,
        },
      });
    });

    setTimeout(search, 0);
  };

  // Trigger search when term changes
  useEffect(() => {
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, search]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-14 right-4 z-50 flex flex-col gap-2 rounded-md border bg-background p-2 shadow-lg w-80",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-sm"
          autoFocus
        />
        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap min-w-12 justify-center">
          {matches.length > 0
            ? `${currentMatchIndex + 1}/${matches.length}`
            : "0/0"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={prevMatch}
          disabled={matches.length === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={nextMatch}
          disabled={matches.length === 0}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Thay thế bằng..."
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          className="h-8 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={replace}
          disabled={matches.length === 0}
        >
          Thay thế
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={replaceAll}
          disabled={matches.length === 0}
        >
          Tất cả
        </Button>
      </div>
    </div>
  );
}
