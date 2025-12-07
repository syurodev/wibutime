"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

interface ImageWithFallbackProps extends ImageProps {
  readonly fallback?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallback,
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (src && src !== "") {
      setIsLoading(true);
      setIsError(false);
    } else {
      setIsLoading(false);
      setIsError(true);
    }
  }, [src]);

  const hasSrc = !!src && src !== "";

  return (
    <>
      {isLoading && hasSrc && (
        <Skeleton
          className={cn(
            "absolute inset-0 z-20 size-full animate-pulse bg-muted",
            className
          )}
        />
      )}

      {isError || !hasSrc ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex size-full items-center justify-center bg-muted text-muted-foreground",
            className
          )}
        >
          <span className="text-xl font-bold uppercase">
            {fallback || "ERR"}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={(e) => {
            setIsLoading(false);
            onLoad?.(e);
          }}
          onError={(e) => {
            setIsLoading(false);
            setIsError(true);
            onError?.(e);
          }}
          {...props}
        />
      )}
    </>
  );
}
