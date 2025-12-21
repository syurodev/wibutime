"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useHomeData } from "./home-data-provider";

export function FreshUpdatesList() {
  const { fresh_updates } = useHomeData();

  if (!fresh_updates.length) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Mới Cập Nhật (Fresh Updates)
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/schedule">View Schedule</Link>
        </Button>
      </div>

      <div className="divide-y rounded-lg border bg-card">
        {fresh_updates.map((chapter) => (
          <div
            key={chapter.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 grid gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate text-sm">
                  <Link
                    href={`/novels/${chapter.novel_slug}`}
                    className="hover:underline"
                  >
                    {chapter.novel_title || "Unknown Novel"}
                  </Link>
                </h3>
                {chapter.volume_id && (
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                    Vol
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Ch. {chapter.chapter_number}
                </span>
                <span>-</span>
                <span>{chapter.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Clock className="h-3.5 w-3.5" />
              {chapter.published_at
                ? formatDistanceToNow(new Date(chapter.published_at), {
                    addSuffix: true,
                  })
                : "Recently"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
