"use client";

import { useCallback, useEffect, useState } from "react";

export interface TranslationProgress {
  translated: number;
  total: number;
  percentage: number;
}

export interface TranslationTrackerResult {
  translatedNodes: Set<string>;
  markAsTranslated: (nodeId: string) => void;
  markAsUntranslated: (nodeId: string) => void;
  getProgress: () => TranslationProgress;
  isTranslated: (nodeId: string) => boolean;
  reset: () => void;
}

interface UseTranslationTrackerOptions {
  totalNodes: number;
  storageKey?: string;
}

/**
 * Hook để track translation progress
 * Auto-save vào localStorage nếu có storageKey
 */
export function useTranslationTracker({
  totalNodes,
  storageKey,
}: UseTranslationTrackerOptions): TranslationTrackerResult {
  // Load từ localStorage nếu có
  const [translatedNodes, setTranslatedNodes] = useState<Set<string>>(() => {
    if (globalThis.window === undefined || !storageKey) {
      return new Set<string>();
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set<string>(parsed);
      }
    } catch (error) {
      console.error("Failed to load translation progress:", error);
    }

    return new Set<string>();
  });

  // Save vào localStorage khi có thay đổi
  useEffect(() => {
    if (!storageKey) return;

    try {
      const data = Array.from(translatedNodes);
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save translation progress:", error);
    }
  }, [translatedNodes, storageKey]);

  const markAsTranslated = useCallback((nodeId: string) => {
    setTranslatedNodes((prev) => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
  }, []);

  const markAsUntranslated = useCallback((nodeId: string) => {
    setTranslatedNodes((prev) => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  }, []);

  const getProgress = useCallback((): TranslationProgress => {
    const translated = translatedNodes.size;
    const percentage = totalNodes > 0 ? (translated / totalNodes) * 100 : 0;

    return {
      translated,
      total: totalNodes,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    };
  }, [translatedNodes, totalNodes]);

  const isTranslated = useCallback(
    (nodeId: string): boolean => {
      return translatedNodes.has(nodeId);
    },
    [translatedNodes]
  );

  const reset = useCallback(() => {
    setTranslatedNodes(new Set<string>());
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Failed to clear translation progress:", error);
      }
    }
  }, [storageKey]);

  return {
    translatedNodes,
    markAsTranslated,
    markAsUntranslated,
    getProgress,
    isTranslated,
    reset,
  };
}
