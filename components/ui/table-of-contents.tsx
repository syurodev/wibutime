"use client";

import { cn } from "@/lib/utils";
import { useEditorRef, useEditorSelector } from "platejs/react";
import { Element } from "slate";
import { ReactEditor } from "slate-react";

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const editor = useEditorRef();

  const headings = useEditorSelector((editor) => {
    const headingList: {
      id: string;
      text: string;
      depth: number;
      path: number[];
    }[] = [];

    // Simple traversal of top-level nodes
    editor.children.forEach((node, index) => {
      if (Element.isElement(node)) {
        if (node.type === "h1" || node.type === "h2" || node.type === "h3") {
          const text = node.children.map((c) => c.text).join("");
          if (text.trim()) {
            // Generate a simple ID or use index if no ID
            const id = `heading-${index}`;
            const depth = parseInt(node.type.replace("h", ""), 10);
            headingList.push({ id, text, depth, path: [index] });
          }
        }
      }
    });
    return headingList;
  }, []);

  const scrollToHeading = (path: number[]) => {
    try {
      const node = editor.children[path[0]];
      if (node) {
        const domNode = ReactEditor.toDOMNode(
          editor as unknown as ReactEditor,
          node
        );
        domNode?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      console.error("Failed to scroll to heading", error);
    }
  };

  return (
    <div
      className={cn(
        "w-64 p-4 h-full overflow-y-auto hidden xl:block",
        className
      )}
    >
      <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground">
        Mục lục
      </h3>
      <div className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.path)}
            className={cn(
              "block text-sm text-left hover:text-primary transition-colors w-full truncate py-1 rounded-sm hover:bg-muted/50 px-2",
              heading.depth === 1 && "font-medium",
              heading.depth === 2 && "pl-6 text-muted-foreground",
              heading.depth === 3 && "pl-10 text-muted-foreground/80"
            )}
          >
            {heading.text}
          </button>
        ))}
        {headings.length === 0 && (
          <p className="text-sm text-muted-foreground italic px-2">
            Chưa có mục lục
          </p>
        )}
      </div>
    </div>
  );
}
