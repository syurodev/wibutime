import { BaseResponse } from "@/commons/interfaces/base-response";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseFetchResult<T> {
  data: BaseResponse<T> | null;
  error: Error | null;
  isLoading: boolean;
  fetchData: (
    url: string,
    params?: Record<string, any>,
    options?: RequestInit
  ) => Promise<void>;
}

const useFetch = <T = any,>(): UseFetchResult<T> => {
  const [data, setData] = useState<BaseResponse<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (
      url: string,
      params?: Record<string, any>,
      options?: RequestInit
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        let finalUrl = process.env.API_ENDPOINT + url;
        if (params) {
          const queryString = new URLSearchParams(params).toString();
          finalUrl = `${process.env.API_ENDPOINT}${url}${
            url.includes("?") ? "&" : "?"
          }${queryString}`;
        }

        const response = await fetch(finalUrl, options);
        if (!response.ok) {
          toast.error(`Error fetching data: ${response.statusText}`);
          return;
        }
        const result = await response.json();
        setData(result as any);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, error, isLoading, fetchData };
};

export default useFetch;
