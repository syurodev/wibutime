/**
 * API Parser Utilities
 * Safe parsing cho API responses với Zod schemas
 * Handle missing data, validation errors, và provide fallbacks
 */

import { z } from "zod";
import type { StandardResponse } from "../types";

/**
 * Parser options
 */
interface ParseOptions {
  /** Log errors to console */
  logErrors?: boolean;
  /** Throw on validation error (default: true) */
  throwOnError?: boolean;
}

/**
 * Array parser options
 */
interface ArrayParseOptions extends ParseOptions {
  /** Minimum number of valid items required */
  minItems?: number;
  /** Skip invalid items instead of failing */
  skipInvalid?: boolean;
}

/**
 * Safe API Parser with comprehensive error handling
 */
export class ApiParser {
  /**
   * Parse single item with strict validation
   * Throws error if validation fails
   *
   * @example
   * const user = ApiParser.parse(UserSchema, data);
   */
  static parse<T>(
    schema: z.ZodSchema<T>,
    data: StandardResponse<unknown>,
    options: ParseOptions = {}
  ): T {
    const { logErrors = true, throwOnError = true } = options;

    try {
      return schema.parse(data.data);
    } catch (error) {
      if (logErrors) {
        console.error("❌ [ApiParser.parse] Validation failed:", {
          error: error instanceof z.ZodError ? error.issues : error,
          data,
        });
      }

      if (throwOnError) {
        throw new Error(
          `Validation failed: ${
            error instanceof z.ZodError
              ? error.issues.map((e: z.core.$ZodIssue) => e.message).join(", ")
              : "Unknown error"
          }`
        );
      }

      throw error;
    }
  }

  /**
   * Safe parse - returns null if validation fails
   * Never throws, good for optional data
   *
   * @example
   * const user = ApiParser.safeParse(UserSchema, data);
   * if (user) { ... }
   */
  static safeParse<T>(
    schema: z.ZodSchema<T>,
    data: StandardResponse<unknown>,
    options: ParseOptions = {}
  ): T | null {
    const { logErrors = false } = options;

    const result = schema.safeParse(data.data);

    if (!result.success) {
      if (logErrors) {
        console.warn("⚠️ [ApiParser.safeParse] Validation failed:", {
          errors: result.error.issues,
          data,
        });
      }
      return null;
    }

    return result.data;
  }

  /**
   * Parse with fallback value
   * Returns fallback if validation fails
   *
   * @example
   * const user = ApiParser.parseWithFallback(UserSchema, data, defaultUser);
   */
  static parseWithFallback<T>(
    schema: z.ZodSchema<T>,
    data: StandardResponse<unknown>,
    fallback: T,
    options: ParseOptions = {}
  ): T {
    const { logErrors = true } = options;

    const result = schema.safeParse(data.data);

    if (!result.success) {
      if (logErrors) {
        console.warn("⚠️ [ApiParser.parseWithFallback] Using fallback value:", {
          errors: result.error.issues,
          data,
        });
      }
      return fallback;
    }

    return result.data;
  }

  /**
   * Parse array and filter invalid items
   * Keeps valid items, skips invalid ones
   *
   * @example
   * const users = ApiParser.parseArray(UserSchema, dataArray);
   */
  static parseArray<T>(
    schema: z.ZodSchema<T>,
    data: StandardResponse<unknown>,
    options: ArrayParseOptions = {}
  ): T[] {
    const { logErrors = true, minItems = 0, skipInvalid = true } = options;

    if (!Array.isArray(data.data)) {
      if (logErrors) {
        console.error("❌ [ApiParser.parseArray] Data is not an array:", data);
      }
      return [];
    }

    const validItems: T[] = [];
    const errors: Array<{ index: number; error: z.ZodError }> = [];

    for (const [index, item] of data.data.entries()) {
      const result = schema.safeParse(item);

      if (result.success) {
        validItems.push(result.data);
      } else if (skipInvalid) {
        errors.push({ index, error: result.error });
      } else {
        throw new Error(
          `Item at index ${index} validation failed: ${result.error.issues
            .map((e) => e.message)
            .join(", ")}`
        );
      }
    }

    // Log errors if any
    if (logErrors && errors.length > 0) {
      console.warn(
        `⚠️ [ApiParser.parseArray] ${errors.length}/${data.data.length} items failed validation:`,
        errors.map((e) => ({
          index: e.index,
          errors: e.error.issues,
        }))
      );
    }

    // Check minimum items requirement
    if (validItems.length < minItems) {
      throw new Error(
        `Expected at least ${minItems} valid items, got ${validItems.length}`
      );
    }

    return validItems;
  }

  /**
   * Parse StandardResponse wrapper
   * Handles API response format with success/error
   *
   * @example
   * const user = ApiParser.parseResponse(UserSchema, apiResponse);
   */
  static parseResponse<T>(
    schema: z.ZodSchema<T>,
    response: StandardResponse<unknown>,
    options: ParseOptions = {}
  ): T {
    const { logErrors = true, throwOnError = true } = options;

    // Check API response success
    if (!response.success) {
      const error = new Error(response.message || "API request failed");

      if (logErrors) {
        console.error("❌ [ApiParser.parseResponse] API error:", {
          message: response.message,
          response,
        });
      }

      if (throwOnError) {
        throw error;
      }

      throw error;
    }

    // Parse the data
    return this.parse(schema, response, options);
  }

  /**
   * Parse StandardResponse with array data
   * Combines response handling + array parsing
   *
   * @example
   * const users = ApiParser.parseResponseArray(UserSchema, apiResponse);
   */
  static parseResponseArray<T>(
    schema: z.ZodSchema<T>,
    response: StandardResponse<unknown>,
    options: ArrayParseOptions = {}
  ): T[] {
    const { logErrors = true, throwOnError = true } = options;

    // Check API response success
    if (!response.success) {
      if (logErrors) {
        console.error("❌ [ApiParser.parseResponseArray] API error:", {
          message: response.message,
          response,
        });
      }

      if (throwOnError) {
        throw new Error(response.message || "API request failed");
      }

      return [];
    }

    // Parse array data
    if (!Array.isArray(response.data)) {
      if (logErrors) {
        console.error(
          "❌ [ApiParser.parseResponseArray] Response data is not an array:",
          response.data
        );
      }
      return [];
    }

    return this.parseArray(schema, response, options);
  }

  /**
   * Parse with retry using multiple schemas
   * Try each schema until one succeeds
   *
   * @example
   * // Try new format, fallback to old format
   * const data = ApiParser.parseWithRetry([NewSchema, LegacySchema], apiData);
   */
  static parseWithRetry<T>(
    schemas: z.ZodSchema<T>[],
    data: StandardResponse<unknown>,
    options: ParseOptions = {}
  ): T {
    const { logErrors = true, throwOnError = true } = options;
    const errors: z.ZodError[] = [];

    for (let i = 0; i < schemas.length; i++) {
      const result = schemas[i].safeParse(data);

      if (result.success) {
        if (logErrors && i > 0) {
          console.warn(
            `⚠️ [ApiParser.parseWithRetry] Succeeded with schema #${i + 1}/${
              schemas.length
            }`
          );
        }
        return result.data;
      }

      errors.push(result.error);
    }

    // All schemas failed
    if (logErrors) {
      console.error(
        "❌ [ApiParser.parseWithRetry] All schemas failed:",
        errors.map((e, i) => ({
          schema: i + 1,
          errors: e.issues,
        }))
      );
    }

    if (throwOnError) {
      throw new Error(`All ${schemas.length} schema validations failed`);
    }

    throw errors[0]; // Throw first error
  }
}

/**
 * Convenience exports for common use cases
 */
export const parse = ApiParser.parse;
export const safeParse = ApiParser.safeParse;
export const parseArray = ApiParser.parseArray;
export const parseResponse = ApiParser.parseResponse;
export const parseResponseArray = ApiParser.parseResponseArray;
