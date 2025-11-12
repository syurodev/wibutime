import { useEffect, useRef, useState, useCallback } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface UseAutosaveOptions {
  /**
   * Unique identifier for this content (for localStorage key)
   */
  contentId: string;

  /**
   * Debounce delay in milliseconds
   * @default 2000
   */
  delay?: number;

  /**
   * API endpoint to save to
   * @example '/api/content/123/draft'
   */
  apiEndpoint?: string;

  /**
   * Enable localStorage backup
   * @default true
   */
  enableLocalStorage?: boolean;

  /**
   * Custom save function (overrides API endpoint)
   */
  onSave?: (value: any[]) => Promise<void>;
}

export interface UseAutosaveReturn {
  /**
   * Current save status
   */
  status: SaveStatus;

  /**
   * Last saved timestamp
   */
  lastSaved: Date | null;

  /**
   * Error message if save failed
   */
  error: string | null;

  /**
   * Trigger save manually
   */
  save: (value: any[]) => Promise<void>;

  /**
   * Load saved draft from localStorage
   */
  loadDraft: () => any[] | null;

  /**
   * Clear draft from localStorage
   */
  clearDraft: () => void;
}

/**
 * Autosave Hook - 3-tier autosave strategy
 *
 * Tier 1: Debounced onChange (2s delay)
 * Tier 2: LocalStorage backup (immediate after debounce)
 * Tier 3: API sync (background, with error handling)
 *
 * @example
 * const { status, lastSaved, save } = useAutosave({
 *   contentId: 'novel-123',
 *   apiEndpoint: '/api/novels/123/draft',
 * });
 *
 * const editor = usePlateEditor({
 *   // In onChange handler, call save(value)
 * });
 */
export function useAutosave({
  contentId,
  delay = 2000,
  apiEndpoint,
  enableLocalStorage = true,
  onSave,
}: UseAutosaveOptions): UseAutosaveReturn {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const latestValueRef = useRef<any[] | undefined>(undefined);

  const storageKey = `autosave-${contentId}`;

  // Save to localStorage
  const saveToLocalStorage = useCallback(
    (value: any[]) => {
      if (!enableLocalStorage) return;
      if (!globalThis.window) return; // Check if running on client
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    },
    [enableLocalStorage, storageKey]
  );

  // Save to API
  const saveToApi = useCallback(
    async (value: any[]) => {
      try {
        if (onSave) {
          await onSave(value);
        } else if (apiEndpoint) {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: value }),
          });

          if (!response.ok) {
            throw new Error(`API save failed: ${response.statusText}`);
          }
        }

        setStatus('saved');
        setLastSaved(new Date());
        setError(null);
      } catch (e) {
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Unknown error');
        console.error('Failed to save to API:', e);
      }
    },
    [apiEndpoint, onSave]
  );

  // Main save function with debouncing
  const save = useCallback(
    async (value: any[]) => {
      latestValueRef.current = value;
      setStatus('unsaved');

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce save
      timeoutRef.current = setTimeout(async () => {
        setStatus('saving');

        // Tier 2: Save to localStorage immediately
        saveToLocalStorage(value);

        // Tier 3: Save to API (background)
        await saveToApi(value);
      }, delay);
    },
    [delay, saveToLocalStorage, saveToApi]
  );

  // Load draft from localStorage
  const loadDraft = useCallback((): any[] | null => {
    if (!enableLocalStorage) return null;
    if (!globalThis.window) return null; // Check if running on client

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return null;
  }, [enableLocalStorage, storageKey]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (!enableLocalStorage) return;
    if (!globalThis.window) return; // Check if running on client

    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }, [enableLocalStorage, storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    save,
    loadDraft,
    clearDraft,
  };
}
