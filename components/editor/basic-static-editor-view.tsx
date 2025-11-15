import type { TNode } from "platejs";

import { cn } from "@/lib/utils";
import { StaticEditorView } from "./static-editor-view";

/**
 * Estimate number of nodes needed for maxLines
 * Each paragraph typically takes 2-3 lines depending on length
 */
function getNodesForMaxLines(content: TNode[], maxLines: number): TNode[] {
  if (maxLines <= 0) return [];

  // Conservative estimate: 1 paragraph ≈ 2 lines
  // For maxLines = 2, we only need 1-2 paragraphs
  // For maxLines = 3, we only need 2 paragraphs
  const estimatedNodes = Math.ceil(maxLines / 2);

  // Take only the estimated number of nodes, minimum 1
  return content.slice(0, Math.max(1, estimatedNodes));
}

/**
 * Compact version for preview or card display
 * Also server-safe!
 *
 * PERFORMANCE: Only renders necessary nodes based on maxLines
 * instead of rendering all content and clipping with CSS
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
  // Optimize: only render nodes needed for maxLines
  const optimizedContent = getNodesForMaxLines(content, maxLines);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        maxHeight: `${maxLines * 1.6}em`,
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        display: "-webkit-box",
      }}
    >
      <StaticEditorView
        content={optimizedContent}
        variant="compact"
        className="p-0"
      />
    </div>
  );
}
