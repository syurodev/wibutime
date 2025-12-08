import type { TNode } from "platejs";
import type React from "react";
import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface StaticEditorViewProps {
  /**
   * Content to display (TNode array from Plate editor)
   */
  readonly content: TNode[];

  /**
   * Additional className for styling
   */
  readonly className?: string;

  /**
   * Container variant
   * @default "default"
   */
  readonly variant?: "default" | "compact" | "fullWidth";
}

/**
 * StaticEditorView Component
 *
 * Simple wrapper để hiển thị content ở dạng HTML tĩnh.
 * Sử dụng dangerouslySetInnerHTML để render content đã được serialize.
 *
 * PERFORMANCE: Uses useMemo to cache rendered nodes and avoid
 * expensive recursive rendering on every render
 *
 * @note Để tránh phức tạp với PlateStatic setup, component này
 * render content dưới dạng HTML đơn giản với styling CSS.
 * Nếu cần full Plate rendering, sử dụng InteractiveEditorView.
 *
 * @example
 * ```tsx
 * import { StaticEditorView } from '@/features/editor/components/static-editor-view';
 *
 * export default function NovelPage() {
 *   return <StaticEditorView content={mockNovelRich} />;
 * }
 * ```
 */
export function StaticEditorView({
  content,
  className,
  variant = "default",
}: StaticEditorViewProps) {
  // Get variant-specific classes
  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "px-4 py-2 text-sm";
      case "fullWidth":
        return "px-8 py-4";
      default:
        return "px-16 py-4 sm:px-[max(64px,calc(50%-350px))]";
    }
  };

  // Memoize rendered nodes to avoid expensive recursive rendering on every render
  // Only re-render if content actually changes
  const renderedNodes = useMemo(() => {
    // Render nodes recursively
    const renderNode = (node: TNode, index: number): React.ReactNode => {
      if ("text" in node) {
        let text: React.ReactNode = node.text as React.ReactNode;

        if (node.bold) text = <strong key={index}>{text}</strong>;
        if (node.italic) text = <em key={index}>{text}</em>;
        if (node.underline) text = <u key={index}>{text}</u>;
        if (node.code) text = <code key={index}>{text}</code>;

        // Handle note mark with tooltip
        if (node.note && node.note_text) {
          text = (
            <Tooltip key={`note-${index}`}>
              <TooltipTrigger asChild>
                <span className="underline decoration-amber-500 decoration-2 cursor-help">
                  {text}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-xs whitespace-pre-wrap text-sm"
              >
                {node.note_text as string}
              </TooltipContent>
            </Tooltip>
          );
        }

        return text;
      }

      if ("children" in node) {
        const children = (node.children as TNode[]).map((child, i) =>
          renderNode(child, i)
        );

        switch (node.type) {
          case "h1":
            return <h1 key={index}>{children}</h1>;
          case "h2":
            return <h2 key={index}>{children}</h2>;
          case "h3":
            return <h3 key={index}>{children}</h3>;
          case "h4":
            return <h4 key={index}>{children}</h4>;
          case "p":
            return <p key={index}>{children}</p>;
          default:
            return <div key={index}>{children}</div>;
        }
      }

      return null;
    };

    return content.map((node, index) => renderNode(node, index));
  }, [content]);

  return (
    <div
      className={cn(
        "relative w-full",
        "border-none bg-transparent",
        getVariantClasses(),
        // Heading styles
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6",
        "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4",
        "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3",
        // Paragraph styles
        "[&_p]:mb-3 [&_p]:leading-relaxed",
        // Text formatting
        "[&_strong]:font-bold",
        "[&_em]:italic",
        "[&_u]:underline",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono",
        className
      )}
    >
      {renderedNodes}
    </div>
  );
}

/**
 * Compact version for preview or card display
 * Also server-safe!
 */
export function CompactEditorView({
  content,
  className,
  maxLines = 3,
  whithoutGradient = false,
}: {
  readonly content: TNode[];
  readonly className?: string;
  readonly maxLines?: number;
  readonly whithoutGradient?: boolean;
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
      <StaticEditorView content={content} variant="compact" />
      {/* Gradient fade at bottom */}
      {!whithoutGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
      )}
    </div>
  );
}

/**
 * Helper function to extract plain text from editor content
 * Useful for SEO, search indexing, or word count
 */
export function extractPlainText(nodes: TNode[]): string {
  return nodes
    .map((node) => {
      if ("text" in node) return node.text;
      if ("children" in node) return extractPlainText(node.children as TNode[]);
      return "";
    })
    .join(" ")
    .trim();
}

/**
 * Helper function to get first paragraph as preview
 */
export function getPreviewText(nodes: TNode[], maxLength = 150): string {
  const text = extractPlainText(nodes);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Helper function to count words in editor content
 */
export function countWords(nodes: TNode[]): number {
  const text = extractPlainText(nodes);
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Helper function to estimate reading time in minutes
 */
export function estimateReadingTime(
  nodes: TNode[],
  wordsPerMinute = 200
): number {
  const words = countWords(nodes);
  return Math.ceil(words / wordsPerMinute);
}
