"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useQueryState(key: string, defaultValue: string = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or default value
  const [value, setValue] = useState(() => {
    return searchParams.get(key) || defaultValue;
  });

  // Update URL when value changes
  const setQueryValue = useCallback(
    (newValue: string | null) => {
      setValue(newValue || defaultValue);
      const params = new URLSearchParams(searchParams.toString());

      if (newValue && newValue !== defaultValue) {
        params.set(key, newValue);
      } else {
        params.delete(key);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, defaultValue, pathname, router, searchParams]
  );

  // Sync with URL changes (e.g. back button)
  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue !== value && paramValue !== null) {
      setValue(paramValue);
    } else if (paramValue === null && value !== defaultValue) {
      setValue(defaultValue);
    }
  }, [searchParams, key, value, defaultValue]);

  return [value, setQueryValue] as const;
}

export function useBooleanQueryState(
  key: string,
  defaultValue: boolean = false
) {
  const [value, setValue] = useQueryState(key, defaultValue ? "true" : "false");

  const boolValue = value === "true";

  const setBoolValue = useCallback(
    (newValue: boolean) => {
      setValue(newValue ? "true" : "false");
    },
    [setValue]
  );

  return [boolValue, setBoolValue] as const;
}
