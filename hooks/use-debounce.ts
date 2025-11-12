import { useEffect, useState } from 'react';

/**
 * Debounce hook - Delays updating value until after delay
 * Useful for autosave, search, etc.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * const [text, setText] = useState('');
 * const debouncedText = useDebounce(text, 500);
 *
 * useEffect(() => {
 *   // This will only run after user stops typing for 500ms
 *   saveToAPI(debouncedText);
 * }, [debouncedText]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
