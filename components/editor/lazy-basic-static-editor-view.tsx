"use client";

import type { TNode } from "platejs";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { BasicStaticEditorView } from "./basic-static-editor-view";
import { extractPlainText } from "./static-editor-view";

/**
 * Get optimized nodes for plain text fallback
 * Only extract text from first few nodes to avoid processing all content
 */
function getOptimizedPlainText(content: TNode[], maxChars: number): string {
  // Only process first 2-3 nodes for plain text (enough for preview)
  const firstNodes = content.slice(0, 2);
  const plainText = extractPlainText(firstNodes);

  if (plainText.length > maxChars) {
    return plainText.slice(0, maxChars) + "...";
  }

  return plainText;
}

/**
 * Lazy-loaded BasicStaticEditorView
 * Only renders full editor when component is visible in viewport
 *
 * PERFORMANCE OPTIMIZATIONS:
 * 1. Intersection Observer - defers rendering until visible
 * 2. Optimized fallback - only processes first 2 nodes for plain text
 * 3. BasicStaticEditorView internally only renders nodes needed for maxLines
 */
export function LazyBasicStaticEditorView({
  content,
  className,
  maxLines = 3,
}: {
  readonly content: TNode[];
  readonly className?: string;
  readonly maxLines?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, we can disconnect observer
            observer.disconnect();
            break; // No need to check other entries
          }
        }
      },
      {
        // Start loading slightly before entering viewport
        rootMargin: "50px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fallback: simple plain text until visible
  // Optimized to only process first 2 nodes
  if (!isVisible) {
    const truncated = getOptimizedPlainText(content, 150);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden text-sm text-muted-foreground",
          className
        )}
        style={{
          maxHeight: `${maxLines * 1.5}em`,
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
        }}
      >
        {truncated}
      </div>
    );
  }

  // Once visible, render full editor (already optimized internally)
  return (
    <div ref={containerRef}>
      <BasicStaticEditorView
        content={content}
        className={className}
        maxLines={maxLines}
      />
    </div>
  );
}
