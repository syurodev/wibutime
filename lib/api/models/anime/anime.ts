/**
 * Anime Domain Model
 * Extends base Series with anime-specific properties
 */

import { Series, type SeriesRaw } from "../content/series";

/**
 * Raw anime data from API
 * Extends SeriesRaw with anime-specific fields
 */
export interface AnimeRaw extends SeriesRaw {
  type: "anime";
  // Anime-specific fields (can be extended in the future)
  // episodes?: number;
  // season?: string;
  // studio?: string;
  // aired_from?: string;
  // aired_to?: string;
}

/**
 * Anime domain model
 * Contains anime-specific logic and properties
 */
export class Anime extends Series {
  // Anime-specific properties can be added here
  // readonly episodes?: number;
  // readonly season?: string;
  // readonly studio?: string;

  constructor(raw: AnimeRaw) {
    super(raw);
    // Map anime-specific properties here
  }

  /**
   * Override toJSON to include anime-specific fields
   */
  toJSON() {
    return {
      ...super.toJSON(),
      // Add anime-specific fields here when needed
    };
  }
}
