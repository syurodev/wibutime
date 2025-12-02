/**
 * API Mutation Hook
 *
 * Xử lý mutations (POST, PUT, DELETE) với error handling tự động:
 * - Auto catch errors
 * - Auto show toast với message từ backend (i18n)
 * - KHÔNG throw lên component
 * - Success message cũng từ backend
 */

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { StandardResponse } from "../types";
import { ApiError } from "../utils/error-handler";

export interface UseApiMutationOptions<TData, TVariables> {
  /**
   * Mutation function to execute
   */
  mutationFn: (
    variables: TVariables
  ) => Promise<StandardResponse<TData> | TData>;

  /**
   * Success callback - nhận response với message đã i18n từ backend
   */
  onSuccess?: (
    response: StandardResponse<TData> | TData,
    variables: TVariables
  ) => void | Promise<void>;

  /**
   * Error callback (optional) - error message đã show toast
   */
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;

  /**
   * Callback sau khi mutation hoàn thành (success hoặc error)
   */
  onSettled?: (
    data: StandardResponse<TData> | TData | null,
    error: ApiError | null,
    variables: TVariables
  ) => void | Promise<void>;

  /**
   * Có show success toast không (default: true)
   */
  showSuccessToast?: boolean;

  /**
   * Có show error toast không (default: true)
   */
  showErrorToast?: boolean;
}

export interface UseApiMutationResult<TData, TVariables> {
  /**
   * Execute mutation
   */
  mutate: (variables: TVariables) => Promise<void>;

  /**
   * Execute mutation và return data
   */
  mutateAsync: (variables: TVariables) => Promise<TData | null>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error nếu có
   */
  error: ApiError | null;

  /**
   * Data sau khi mutation thành công
   */
  data: TData | null;

  /**
   * Reset state
   */
  reset: () => void;
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  options: UseApiMutationOptions<TData, TVariables>
): UseApiMutationResult<TData, TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const {
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await mutationFn(variables);

        // Extract data từ StandardResponse hoặc direct data
        let responseData: TData;
        let responseMessage: string | undefined;

        if (response && typeof response === "object" && "success" in response) {
          // StandardResponse format
          const standardResp = response as StandardResponse<TData>;
          responseData = standardResp.data as TData;
          responseMessage = standardResp.message;
        } else {
          // Direct data (backward compatibility)
          responseData = response as TData;
        }

        setData(responseData);

        // ✅ Show success toast với message từ backend
        if (showSuccessToast && responseMessage) {
          toast.success(responseMessage);
        }

        // Call onSuccess callback
        await onSuccess?.(response, variables);

        // Call onSettled
        await onSettled?.(response, null, variables);

        return responseData;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                err instanceof Error ? err.message : "Unknown error",
                500
              );

        setError(apiError);

        // ✅ Show error toast với message từ backend (đã i18n)
        if (showErrorToast) {
          toast.error(apiError.message);
        }

        // Call onError callback
        await onError?.(apiError, variables);

        // Call onSettled
        await onSettled?.(null, apiError, variables);

        // ❌ KHÔNG throw - để tránh error overlay
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      mutationFn,
      onSuccess,
      onError,
      onSettled,
      showSuccessToast,
      showErrorToast,
    ]
  );

  const mutate = useCallback(
    async (variables: TVariables): Promise<void> => {
      await mutateAsync(variables);
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    isLoading,
    error,
    data,
    reset,
  };
}
