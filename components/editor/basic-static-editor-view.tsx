import type { TNode } from "platejs";

import { cn } from "@/lib/utils";
import { StaticEditorView } from "./static-editor-view";

/**
 * Compact version for preview or card display
 * Also server-safe!
 */
export function BasicStaticEditorView({
  content,
  className,
  maxLines = 3,
}: {
  readonly content: TNode[];
  readonly className?: string;
  readonly maxLines?: number;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        maxHeight: `${maxLines * 1.5}em`,
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        display: "-webkit-box",
      }}
    >
      <StaticEditorView content={content} variant="compact" className="p-0" />
    </div>
  );
}
