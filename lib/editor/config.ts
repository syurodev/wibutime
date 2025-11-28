/**
 * Shared Editor Configuration
 *
 * Centralized configuration for Plate.js editors across the application.
 * Uses UUID v7 (time-ordered, lexicographically sortable) via uuid package.
 */

import { v7 as uuidv7 } from "uuid";

/**
 * Node ID configuration for all editors
 *
 * Key behaviors:
 * - Uses UUID v7 (time-ordered) via uuid package
 * - Preserves existing node IDs when loading content (normalizeInitialValue: false)
 * - Only assigns IDs to new nodes during insertion
 * - Filters inline elements and text nodes (standard practice)
 *
 * @example
 * ```tsx
 * import { editorNodeIdConfig } from "@/lib/editor/config";
 *
 * const editor = usePlateEditor({
 *   plugins: [...],
 *   value: initialValue,
 *   nodeId: editorNodeIdConfig,
 * });
 * ```
 */
export const editorNodeIdConfig = {
  /**
   * ID generator using UUID v7 from uuid package
   * Time-ordered and lexicographically sortable
   * Compatible with all environments (Bun, Node.js, browsers)
   */
  idCreator: uuidv7,

  /**
   * CRITICAL: Do not normalize initial values
   * This preserves existing node IDs when loading content from database/localStorage
   * Only generates IDs for new nodes created during editing
   */
  normalizeInitialValue: false,

  /**
   * Do not assign IDs to inline elements
   * Standard practice - only block-level elements need IDs
   */
  filterInline: true,

  /**
   * Do not assign IDs to text nodes
   * Standard practice - only element nodes need IDs
   */
  filterText: true,

  /**
   * Do not reuse IDs on undo/redo operations
   * Creates new IDs for better tracking and debugging
   */
  reuseId: false,

  /**
   * Allow manual ID override when inserting nodes
   * Useful for migration or specific use cases
   */
  disableInsertOverrides: false,
};
