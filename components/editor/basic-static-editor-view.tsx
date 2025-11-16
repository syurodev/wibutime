import type { TNode } from "platejs";

import { cn } from "@/lib/utils";
import { StaticEditorView } from "./static-editor-view";

/**
 * Normalize all nodes to paragraphs for consistent line clamping
 * Converts h1, h2, h3, h4, div → p while keeping children/formatting
 */
function normalizeNodesToParagraphs(nodes: TNode[]): TNode[] {
  return nodes.map((node) => {
    if ("type" in node && node.type !== "p") {
      // Convert any block element (h1, h2, h3, h4, div) to paragraph
      return { ...node, type: "p" };
    }
    return node;
  });
}

/**
 * Estimate number of nodes needed for maxLines
 * Since we normalize to paragraphs, estimation is simpler
 */
function getNodesForMaxLines(content: TNode[], maxLines: number): TNode[] {
  if (maxLines <= 0) return [];
  if (content.length === 0) return [];

  // With normalized paragraphs: 1 paragraph ≈ 1-2 lines
  // Conservative: take maxLines nodes (each might be 1-2 lines)
  const estimatedNodes = Math.max(1, Math.ceil(maxLines / 1.5));

  return content.slice(0, Math.min(estimatedNodes, content.length));
}

/**
 * Compact version for preview or card display
 * Also server-safe!
 *
 * STRATEGY:
 * - Normalizes all nodes (h1, h2, h3, h4) to paragraphs for uniform structure
 * - This makes -webkit-line-clamp work correctly with all content
 * - Pre-slices content for performance (only renders needed nodes)
 * - Uses accurate line-height calculation (1.625 = leading-relaxed)
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
  // Step 1: Normalize all nodes to paragraphs for consistent line-clamp behavior
  const normalizedContent = normalizeNodesToParagraphs(content);

  // Step 2: Optimize - only render nodes needed for maxLines
  const optimizedContent = getNodesForMaxLines(normalizedContent, maxLines);

  // Line height matches Tailwind's leading-relaxed
  const LINE_HEIGHT = 1.625;

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        // Fallback max-height in case -webkit-line-clamp isn't supported
        maxHeight: `${maxLines * LINE_HEIGHT}em`,
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
