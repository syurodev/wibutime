/**
 * Nav Pagination Button Component
 * Compact inline pagination for bottom navigation with direct page input
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

export interface NavPaginationButtonProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly isActive?: boolean;
}

export function NavPaginationButton({
  currentPage,
  totalPages,
  onPageChange,
  isActive = false,
}: NavPaginationButtonProps) {
  const t = useTranslations("common.pagination");
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Input mode state
  const [isInputMode, setIsInputMode] = useState(false);
  const [inputValue, setInputValue] = useState(String(currentPage));
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering input mode
  useEffect(() => {
    if (isInputMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInputMode]);

  // Update input value when currentPage changes externally
  useEffect(() => {
    if (!isInputMode) {
      setInputValue(String(currentPage));
    }
  }, [currentPage, isInputMode]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  // Enter input mode when clicking on page display
  const handlePageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInputMode(true);
    setInputValue(String(currentPage));
  };

  // Handle input change (only allow numbers)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  // Handle input submission
  const handleInputSubmit = () => {
    const pageNumber = parseInt(inputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
    setIsInputMode(false);
  };

  // Handle keyboard events
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsInputMode(false);
      setInputValue(String(currentPage));
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Reset to current page if input is invalid
    const pageNumber = parseInt(inputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
    setIsInputMode(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-2 transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/60 hover:text-foreground"
      )}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all",
          canGoPrev
            ? "hover:bg-primary/20 active:scale-95"
            : "cursor-not-allowed opacity-30"
        )}
        aria-label="Previous page"
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Display / Input */}
      {isInputMode ? (
        // Input mode: allow direct page number entry
        <div className="flex items-center gap-1 px-1 text-sm font-medium">
          <span className="hidden sm:inline text-foreground/60">{t("page")}</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className={cn(
              "w-10 bg-transparent text-center outline-none",
              "border-b border-primary/50 focus:border-primary",
              "transition-colors"
            )}
            aria-label={t("goToPage")}
          />
          <span className="text-foreground/40">/</span>
          <span className="text-foreground/60">{totalPages}</span>
        </div>
      ) : (
        // Display mode: click to enter input mode
        <button
          onClick={handlePageClick}
          className={cn(
            "flex items-center gap-1 px-1 text-sm font-medium",
            "hover:text-primary transition-colors cursor-pointer",
            "rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
          aria-label={t("clickToEnterPage")}
          type="button"
        >
          <span className="hidden sm:inline">{t("page")}</span>
          <span>{currentPage}</span>
          <span className="text-foreground/40">/</span>
          <span className="text-foreground/60">{totalPages}</span>
        </button>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full transition-all",
          canGoNext
            ? "hover:bg-primary/20 active:scale-95"
            : "cursor-not-allowed opacity-30"
        )}
        aria-label="Next page"
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
