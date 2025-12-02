/**
 * API Query Hook
 *
 * Xử lý queries (GET) với error handling tự động:
 * - Auto catch errors
 * - Auto show toast on error (optional)
 * - KHÔNG throw lên component
 * - Retry logic
 */

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { StandardResponse } from "../types";
import { ApiError } from "../utils/error-handler";

export interface UseApiQueryOptions<TData> {
  /**
   * Query function to execute
   */
  queryFn: () => Promise<StandardResponse<TData> | TData>;

  /**
   * Query key for caching/refetching
   */
  queryKey?: unknown[];

  /**
   * Enable/disable query (default: true)
   */
  enabled?: boolean;

  /**
   * Retry count on error (default: 0)
   */
  retry?: number;

  /**
   * Retry delay in ms (default: 1000)
   */
  retryDelay?: number;

  /**
   * Show error toast (default: false - queries thường không cần toast)
   */
  showErrorToast?: boolean;

  /**
   * Success callback
   */
  onSuccess?: (data: TData) => void | Promise<void>;

  /**
   * Error callback
   */
  onError?: (error: ApiError) => void | Promise<void>;
}

export interface UseApiQueryResult<TData> {
  /**
   * Query data
   */
  data: TData | null;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error nếu có
   */
  error: ApiError | null;

  /**
   * Refetch query
   */
  refetch: () => Promise<void>;

  /**
   * Is refetching
   */
  isRefetching: boolean;
}

export function useApiQuery<TData = unknown>(
  options: UseApiQueryOptions<TData>
): UseApiQueryResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    queryFn,
    queryKey,
    enabled = true,
    retry = 0,
    retryDelay = 1000,
    showErrorToast = false,
    onSuccess,
    onError,
  } = options;

  const fetchData = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return;

      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await queryFn();

        // Extract data từ StandardResponse hoặc direct data
        let responseData: TData;

        if (response && typeof response === "object" && "success" in response) {
          // StandardResponse format
          const standardResp = response as StandardResponse<TData>;
          responseData = standardResp.data as TData;
        } else {
          // Direct data
          responseData = response as TData;
        }

        setData(responseData);
        setRetryCount(0); // Reset retry count on success

        // Call onSuccess callback
        await onSuccess?.(responseData);
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                err instanceof Error ? err.message : "Unknown error",
                500
              );

        setError(apiError);

        // Retry logic
        if (retryCount < retry) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            fetchData(isRefetch);
          }, retryDelay);
          return;
        }

        // Show error toast only if enabled
        if (showErrorToast) {
          toast.error(apiError.message);
        }

        // Call onError callback
        await onError?.(apiError);

        // ❌ KHÔNG throw - để tránh error overlay
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    },
    [
      enabled,
      queryFn,
      retry,
      retryDelay,
      retryCount,
      showErrorToast,
      onSuccess,
      onError,
    ]
  );

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Auto-fetch on mount and when queryKey changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...(queryKey || [])]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  };
}
