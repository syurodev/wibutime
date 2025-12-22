"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { MEDIA_TYPE } from "@/lib/constants/default";
import { cn } from "@/lib/utils";
import { getContentBadgeVariant } from "@/lib/utils/get-content-bg";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { getMediaResumePath } from "@/lib/utils/get-media-resume-path";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { BookOpen, ChevronRight, Clock, Play, X } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";
import { HistoryItem } from "../types";

export interface HistoryCardProps {
  readonly item: HistoryItem;
  readonly className?: string;
  readonly resumeHref?: string;
  readonly onRemove?: (item: HistoryItem) => void;
  readonly currentTime?: number;
}

const getResumeInfo = (
  item: HistoryItem
): { icon: typeof Play; label: string; subLabel?: string } => {
  const mediaType = item.media?.type;
  const unitNum = item.latest_unit?.number;
  const unitTitle = item.latest_unit?.title;

  switch (mediaType) {
    case MEDIA_TYPE.ANIME: {
      const time = item.anime_last_episode_time_viewed;
      return {
        icon: Play,
        label: unitNum ? `Tập ${unitNum}` : "Tiếp tục xem",
        subLabel: time || unitTitle,
      };
    }
    case MEDIA_TYPE.MANGA: {
      const page = item.manga_last_page_read;
      return {
        icon: BookOpen,
        label: unitNum ? `Chương ${unitNum}` : "Tiếp tục đọc",
        subLabel: typeof page === "number" ? `Trang ${page + 1}` : unitTitle,
      };
    }
    default: {
      // Novel
      return {
        icon: BookOpen,
        label: unitNum ? `Chương ${unitNum}` : "Tiếp tục đọc",
        subLabel: unitTitle,
      };
    }
  }
};

export const HistoryCard = memo(function HistoryCard({
  item,
  className,
  resumeHref,
  onRemove,
  currentTime,
}: HistoryCardProps) {
  const { href, relativeTime, resumeInfo, author, progress } = useMemo(() => {
    // Build resume path
    const path =
      resumeHref ??
      (item.media
        ? getMediaResumePath({
            slug: item.media.slug,
            type: item.media.type,
          })
        : "#");

    // Format relative time
    let timeStr: string | null = null;
    const timeSource = item.last_viewed_at || item.content_updated_at;
    if (timeSource && currentTime) {
      const date = new Date(timeSource);
      if (!Number.isNaN(date.getTime())) {
        timeStr = formatDistance(date, currentTime, {
          addSuffix: true,
          locale: vi,
        });
      }
    }

    return {
      href: path,
      relativeTime: timeStr,
      resumeInfo: getResumeInfo(item),
      author: item.media?.author,
      progress: item.user_progress_percentage ?? 0,
    };
  }, [item, resumeHref, currentTime]);

  // Guard against missing media
  if (!item.media) {
    return null;
  }

  const { media } = item;
  const ResumeIcon = resumeInfo.icon;

  return (
    <div
      className={cn(
        "group/card relative rounded-[20px] border-4 border-secondary bg-card",
        "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        "h-full", // Fill parent height
        className
      )}
    >
      <Link href={href} className="flex overflow-hidden rounded-2xl h-full">
        {/* LEFT: Cover Image */}
        <div className="relative w-28 shrink-0">
          <Image
            src={getImageUrl(media.cover_url)}
            alt={media.title}
            fill
            sizes="112px"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-card/80" />

          {/* Badge Type */}
          <Badge
            variant={getContentBadgeVariant(media.type, false)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 scale-90 px-2 py-0.5 text-[9px] shadow-sm border-0 capitalize"
          >
            {media.type}
          </Badge>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-1 flex-col p-3 min-w-0">
          {/* Row 1: Title */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover/card:text-primary transition-colors">
              {media.title}
            </h3>

            {/* Author */}
            {author && (
              <div className="flex items-center gap-1.5 mt-2">
                <Avatar className="size-5 border border-border/50">
                  <AvatarImage src={getImageUrl(author.avatar_url)} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(author.display_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] text-muted-foreground truncate">
                  {author.display_name}
                </span>
              </div>
            )}

            {/* Progress bar */}
            {progress > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Progress value={progress} className="h-1.5 flex-1" />
                <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                  {Math.round(progress)}%
                </span>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              <span>{relativeTime ?? "Vừa xong"}</span>
            </div>
          </div>

          {/* Row 2: Resume Button - always at bottom */}
          <div
            className={cn(
              "mt-3 flex items-center justify-between rounded-lg px-2.5 py-2",
              "bg-secondary/50 group-hover/card:bg-primary/10",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ResumeIcon className="size-4 text-foreground shrink-0" />
              <div className="flex flex-col leading-none min-w-0">
                <span className="text-xs font-bold text-foreground truncate">
                  {resumeInfo.label}
                </span>
                {resumeInfo.subLabel && (
                  <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {resumeInfo.subLabel}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground/60 shrink-0" />
          </div>
        </div>
      </Link>

      {/* Remove Button */}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2 z-30 h-6 w-6 rounded-full bg-background border border-border shadow-sm text-muted-foreground opacity-0 group-hover/card:opacity-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item);
          }}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
});
