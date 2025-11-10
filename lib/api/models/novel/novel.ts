/**
 * Novel Domain Model
 * Extends base Series with novel-specific properties
 */

import { Series, type SeriesRaw } from "../content/series";

/**
 * Raw novel data from API
 * Extends SeriesRaw with novel-specific fields
 */
export interface NovelRaw extends SeriesRaw {
  type: "novel";
  // Novel-specific fields (can be extended in the future)
  // word_count?: number;
  // author?: string;
  // publisher?: string;
  // language?: string;
}

/**
 * Novel domain model
 * Contains novel-specific logic and properties
 */
export class Novel extends Series {
  // Novel-specific properties can be added here
  // readonly wordCount?: number;
  // readonly author?: string;
  // readonly publisher?: string;

  constructor(raw: NovelRaw) {
    super(raw);
    // Map novel-specific properties here
  }

  /**
   * Override toJSON to include novel-specific fields
   */
  toJSON() {
    return {
      ...super.toJSON(),
      // Add novel-specific fields here when needed
    };
  }
}
