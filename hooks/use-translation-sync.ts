"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseTranslationSyncOptions {
  sourceRef: RefObject<HTMLElement>;
  translationRef: RefObject<HTMLElement>;
  enabled: boolean;
}

/**
 * Hook để sync scroll giữa 2 editors
 * Sử dụng scroll percentage để sync, tránh infinite loop bằng debounce + flag
 */
export function useTranslationSync({
  sourceRef,
  translationRef,
  enabled,
}: UseTranslationSyncOptions) {
  const isSyncingRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const sourceEl = sourceRef.current;
    const translationEl = translationRef.current;

    if (!sourceEl || !translationEl) return;

    const syncScroll = (
      fromElement: HTMLElement,
      toElement: HTMLElement,
      source: "source" | "translation"
    ) => {
      // Tránh infinite loop
      if (isSyncingRef.current) return;

      // Clear timeout cũ
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set flag để tránh sync ngược lại
      isSyncingRef.current = true;

      // Tính scroll percentage
      const scrollTop = fromElement.scrollTop;
      const scrollHeight = fromElement.scrollHeight - fromElement.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      // Apply vào element kia
      const targetScrollHeight =
        toElement.scrollHeight - toElement.clientHeight;
      const targetScrollTop = targetScrollHeight * scrollPercentage;

      toElement.scrollTop = targetScrollTop;

      // Reset flag sau một khoảng thời gian ngắn
      timeoutRef.current = globalThis.window.setTimeout(() => {
        isSyncingRef.current = false;
      }, 50) as unknown as number;
    };

    const handleSourceScroll = () => {
      syncScroll(sourceEl, translationEl, "source");
    };

    const handleTranslationScroll = () => {
      syncScroll(translationEl, sourceEl, "translation");
    };

    sourceEl.addEventListener("scroll", handleSourceScroll, { passive: true });
    translationEl.addEventListener("scroll", handleTranslationScroll, {
      passive: true,
    });

    return () => {
      sourceEl.removeEventListener("scroll", handleSourceScroll);
      translationEl.removeEventListener("scroll", handleTranslationScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sourceRef, translationRef, enabled]);
}
