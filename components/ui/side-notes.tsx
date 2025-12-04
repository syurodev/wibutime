"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronRight, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

interface SideNotesProps {
  novelId: string;
  className?: string;
}

export function SideNotes({ novelId, className }: SideNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const storageKey = `novel-notes-${novelId}`;

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  // Save notes to localStorage with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(storageKey, notes);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, storageKey]);

  return (
    <div
      className={cn(
        "fixed right-0 top-20 z-40 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%-2.5rem)]",
        className
      )}
    >
      <div className="flex h-[500px] items-start">
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-l-md rounded-r-none border-r-0 bg-background shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <StickyNote className="h-4 w-4" />
          )}
        </Button>

        {/* Notes Content */}
        <div className="h-full w-80 rounded-bl-md border bg-background shadow-lg p-4 flex flex-col gap-2">
          <h3 className="font-semibold flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Ghi chú
          </h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú nhanh cho novel này..."
            className="flex-1 resize-none focus-visible:ring-1"
          />
          <p className="text-xs text-muted-foreground">
            Tự động lưu vào trình duyệt
          </p>
        </div>
      </div>
    </div>
  );
}
