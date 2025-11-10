/**
 * Manga Domain Model
 * Extends base Series with manga-specific properties
 */

import { Series, type SeriesRaw } from "../content/series";

/**
 * Raw manga data from API
 * Extends SeriesRaw with manga-specific fields
 */
export interface MangaRaw extends SeriesRaw {
  type: "manga";
  // Manga-specific fields (can be extended in the future)
  // volumes?: number;
  // chapters?: number;
  // serialization?: string;
  // author?: string;
  // artist?: string;
}

/**
 * Manga domain model
 * Contains manga-specific logic and properties
 */
export class Manga extends Series {
  // Manga-specific properties can be added here
  // readonly volumes?: number;
  // readonly chapters?: number;
  // readonly author?: string;

  constructor(raw: MangaRaw) {
    super(raw);
    // Map manga-specific properties here
  }

  /**
   * Override toJSON to include manga-specific fields
   */
  toJSON() {
    return {
      ...super.toJSON(),
      // Add manga-specific fields here when needed
    };
  }
}
