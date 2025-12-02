"use client";

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  onSearch,
  onLoadMore,
  loading,
  hasMore,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(inputValue);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [inputValue, onSearch]);

  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastOptionRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  const handleUnselect = (item: Option) => {
    onChange(selected.filter((i) => i.value !== item.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          handleUnselect(selected[selected.length - 1]);
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const selectables = options.filter(
    (option) => !selected.some((s) => s.value === option.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn("overflow-visible bg-transparent", className)}
      shouldFilter={!onSearch}
    >
      <div
        className={cn(
          "group border-input px-4 py-1 text-sm ring-offset-background rounded-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "flex min-h-11 w-full flex-wrap gap-1 rounded-xl border bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "dark:bg-input/30"
        )}
      >
        <div className="flex gap-1 flex-wrap w-full">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[100px]"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div
            className="absolute top-0 z-[100] w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
            onMouseDown={(e) => e.preventDefault()}
          >
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="h-full overflow-auto max-h-60">
                {selectables.map((option, index) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...selected, option]);
                    }}
                    className="cursor-pointer"
                    ref={
                      index === selectables.length - 1 ? lastOptionRef : null
                    }
                  >
                    {option.label}
                  </CommandItem>
                ))}
                {loading && <CommandItem disabled>Loading...</CommandItem>}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
