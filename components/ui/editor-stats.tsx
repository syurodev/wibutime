"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Clock, Target, Type } from "lucide-react";
import { useEditorState } from "platejs/react";
import * as React from "react";

interface EditorStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  goal?: number; // Word count goal
}

export function EditorStats({
  className,
  goal = 0,
  ...props
}: EditorStatsProps) {
  const editor = useEditorState();

  const text = editor.api.string([]);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute

  // Calculate progress towards goal
  const progress = goal > 0 ? Math.min((wordCount / goal) * 100, 100) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-4 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {/* Character Count */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help hover:text-foreground transition-colors">
            <Type className="h-3.5 w-3.5" />
            <span>{charCount.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Characters (including spaces)</p>
        </TooltipContent>
      </Tooltip>

      {/* Reading Time */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help hover:text-foreground transition-colors">
            <Clock className="h-3.5 w-3.5" />
            <span>{readingTime} min read</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Estimated reading time</p>
        </TooltipContent>
      </Tooltip>

      {/* Goal Progress (only if goal is set) */}
      {goal > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help hover:text-foreground transition-colors">
              <Target className="h-3.5 w-3.5" />
              <div className="flex items-center gap-2">
                <span>{Math.round(progress)}%</span>
                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {wordCount} / {goal} words goal
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
