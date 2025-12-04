import { useEditorRef } from "platejs/react";
import { useEffect, useRef } from "react";
import { Range } from "slate";
import { ReactEditor } from "slate-react";

export function useTypewriterScroll<
  T extends HTMLElement = HTMLElement
>(options: {
  enabled: boolean;
  containerRef: React.RefObject<T>;
  offset?: number; // Offset from center (percentage 0-1), default 0.5
}) {
  const { enabled, containerRef, offset = 0.5 } = options;
  const editor = useEditorRef();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (!enabled || !editor) return;

    const handleScroll = () => {
      // Logic to detect manual scroll to temporarily disable typewriter?
      // For simplicity, we just let it override for now.
    };

    const updateScroll = () => {
      if (!editor.selection || Range.isExpanded(editor.selection)) return;
      if (!containerRef.current) return;

      try {
        const domRange = ReactEditor.toDOMRange(
          editor as unknown as ReactEditor,
          editor.selection
        );
        const rect = domRange.getBoundingClientRect();
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();

        // Calculate the position of the cursor relative to the container
        const cursorTop = rect.top - containerRect.top + container.scrollTop;

        // Target scroll position (center of container)
        const targetScrollTop = cursorTop - container.clientHeight * offset;

        // Smooth scroll
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      } catch (e) {
        // Ignore errors (e.g. selection not in DOM)
      }
    };

    // Listen to selection changes
    // Plate doesn't expose a direct "onSelectionChange" event that is easy to hook into for side effects
    // without re-rendering.
    // However, we can use the onChange handler in the component using this hook,
    // or rely on the fact that this hook re-runs when `editor.selection` changes if we were using `useEditorSelector`.
    // But `useEditorRef` doesn't trigger re-render on selection change.

    // We need to subscribe to editor changes.
    // In Plate/Slate, we can overwrite `onChange`.

    const originalOnChange = editor.onChange as (() => void) | undefined;
    editor.onChange = () => {
      originalOnChange?.();
      if (enabled) {
        // Use requestAnimationFrame to avoid layout thrashing and ensure DOM is updated
        requestAnimationFrame(updateScroll);
      }
    };

    return () => {
      editor.onChange = originalOnChange;
    };
  }, [enabled, editor, containerRef, offset]);
}
