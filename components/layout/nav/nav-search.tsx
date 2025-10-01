"use client";

import {AnimatePresence, motion} from "framer-motion";
import {Loader2, Search} from "lucide-react";
import Link from "next/link";
import {FormEvent, ReactNode, useEffect, useMemo, useRef, useState,} from "react";

export interface NavSearchResult {
  id: string;
  title: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
  badge?: string;
  onSelect?: () => void;
  autoClose?: boolean;
}

interface NavSearchProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onQueryChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onResultSelect?: (result: NavSearchResult) => void;
  placeholder?: string;
  width?: number;
  results?: NavSearchResult[];
  isLoading?: boolean;
  emptyState?: ReactNode;
}

const DEFAULT_WIDTH = 304;

export default function NavSearch({
                                    isOpen,
                                    onOpen,
                                    onClose,
                                    onQueryChange,
                                    onSubmit,
                                    onResultSelect,
                                    placeholder = "Nhập từ khóa...",
                                    width = DEFAULT_WIDTH,
                                    results = [],
                                    isLoading = false,
                                    emptyState,
                                  }: NavSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultWidth = useMemo(() => {
    const expanded = width * 1.35;
    return Math.round(Math.max(Math.min(expanded, 520), 320));
  }, [width]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      return;
    }

    setQuery("");
    onQueryChange?.("");
  }, [isOpen, onQueryChange]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOpen = () => {
    if (!isOpen) {
      onOpen();
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(query);
  };

  const shouldShowResults = useMemo(
      () => isOpen && query.trim().length > 0,
      [isOpen, query],
  );

  const handleResultSelect = (result: NavSearchResult) => {
    result.onSelect?.();
    onResultSelect?.(result);

    if (result.autoClose !== false) {
      onClose();
    }
  };

  const renderResultContent = (result: NavSearchResult) => (
      <div className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-muted/70">
        {result.icon && <span className="mt-0.5 text-muted-foreground">{result.icon}</span>}
        <div className="flex flex-1 flex-col text-left">
          <span className="text-sm font-medium text-foreground">{result.title}</span>
          {result.description && (
              <span className="text-xs text-muted-foreground">{result.description}</span>
          )}
        </div>
        {result.badge && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {result.badge}
            </span>
        )}
      </div>
  );

  return (
      <motion.div
          className="relative flex h-12 items-center"
          initial={{y: 100, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 35,
            delay: 0.1,
            layout: {
              duration: 0.25,
              ease: "easeInOut",
            },
          }}
          layout
      >
        <motion.div
            className="flex h-12 items-center overflow-hidden rounded-full border border-gray-200/50 bg-background/60 shadow-lg backdrop-blur-md"
            animate={{width: isOpen ? width : 48}}
            transition={{type: "spring", stiffness: 240, damping: 28, delay: isOpen ? 0.05 : 0}}
            layout
        >
          <button
              type="button"
              onClick={handleOpen}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
              aria-label="Mở tìm kiếm"
              aria-expanded={isOpen}
              disabled={isOpen}
          >
            <Search className="h-5 w-5"/>
          </button>
          <AnimatePresence initial={false}>
            {isOpen && (
                <motion.form
                    key="search-field"
                    onSubmit={handleSubmit}
                    className="flex flex-1 items-center gap-2 pr-4"
                    initial={{opacity: 0, x: 12}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 12}}
                    transition={{duration: 0.18, delay: 0.1}}
                >
                  <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => handleChange(event.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-sm placeholder:text-gray-400 outline-none"
                      aria-label="Tìm kiếm"
                  />
                </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {shouldShowResults && (
              <motion.div
                  key="search-results"
                  className="pointer-events-none fixed left-1/2 z-[9999] flex justify-center transform -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200/50 bg-background/60 shadow-lg backdrop-blur-md transition-colors duration-200"
                  style={{bottom: "5.5rem", width: resultWidth}}
                  initial={{opacity: 0, y: 16, scale: 0.97}}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  exit={{opacity: 0, y: 16, scale: 0.97}}
                  transition={{duration: 0.2, ease: "easeOut"}}
              >
                <div
                    className="pointer-events-auto w-full "
                >
                  {isLoading ? (
                      <div className="flex items-center justify-center px-4 py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
                      </div>
                  ) : results.length ? (
                      <div className="max-h-64 overflow-y-auto py-1">
                        {results.map((result) => {
                          const content = renderResultContent(result);

                          if (result.href) {
                            return (
                                <Link
                                    key={result.id}
                                    href={result.href}
                                    className="block"
                                    onClick={() => handleResultSelect(result)}
                                >
                                  {content}
                                </Link>
                            );
                          }

                          return (
                              <button
                                  key={result.id}
                                  type="button"
                                  className="block w-full text-left"
                                  onClick={() => handleResultSelect(result)}
                              >
                                {content}
                              </button>
                          );
                        })}
                      </div>
                  ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        {emptyState ?? "Không tìm thấy kết quả phù hợp."}
                      </div>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
}
