/**
 * Base Model Class for API Data Mapping
 */

/**
 * Model constructor type
 */
export type ModelConstructor<TRaw, TModel extends BaseModel<TRaw>> = {
  new (raw: TRaw): TModel;
};

/**
 * Abstract base model class
 * All domain models should extend this class
 */
export abstract class BaseModel<TRaw = unknown> {
  /**
   * Map raw API data to model instance
   * @param raw Raw data from API
   * @returns Mapped model instance
   */
  static fromApi<TRaw, TModel extends BaseModel<TRaw>>(
    this: ModelConstructor<TRaw, TModel>,
    raw: TRaw
  ): TModel {
    return new this(raw);
  }

  /**
   * Map array of raw API data to model instances
   * @param rawArray Array of raw data from API
   * @returns Array of mapped model instances
   */
  static fromApiArray<TRaw, TModel extends BaseModel<TRaw>>(
    this: ModelConstructor<TRaw, TModel>,
    rawArray: TRaw[]
  ): TModel[] {
    return rawArray.map((raw) => new this(raw));
  }

  /**
   * Constructor that accepts raw data
   * Subclasses should implement mapping logic in their constructor
   */
  constructor(protected raw: TRaw) {}

  /**
   * Get the original raw data
   */
  getRawData(): TRaw {
    return this.raw;
  }
}

/**
 * Helper type to extract raw data type from model
 */
export type RawDataType<T> = T extends BaseModel<infer R> ? R : never;

/**
 * Helper function to safely map nullable data
 */
export function mapNullable<TRaw, TModel extends BaseModel<TRaw>>(
  data: TRaw | null | undefined,
  ModelClass: ModelConstructor<TRaw, TModel>
): TModel | null {
  if (data === null || data === undefined) {
    return null;
  }
  return new ModelClass(data);
}

/**
 * Helper function to safely map array data
 */
export function mapArray<TRaw, TModel extends BaseModel<TRaw>>(
  data: TRaw[] | null | undefined,
  ModelClass: ModelConstructor<TRaw, TModel>
): TModel[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((raw) => new ModelClass(raw));
}
