"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HistoryMedia } from "@/features/history/types/history-content";
import { Link } from "@/i18n/routing";
import { MEDIA_TYPE } from "@/lib/constants/default";
import { cn } from "@/lib/utils";
import { getContentBadgeVariant } from "@/lib/utils/get-content-bg";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { getMediaResumePath } from "@/lib/utils/get-media-resume-path";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import {
  BookOpen,
  ChevronRight,
  Clock,
  LucideIcon,
  PauseCircle,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export interface HistoryCardProps {
  readonly item: HistoryMedia;
  readonly className?: string;
  readonly resumeHref?: string;
  readonly onRemove?: (item: HistoryMedia) => void;
  readonly currentTime?: number;
}

type ResumeMeta = {
  icon: LucideIcon;
  label: string;
  meta?: string;
};

const getResumeMeta = (item: HistoryMedia): ResumeMeta => {
  switch (item.type) {
    case MEDIA_TYPE.ANIME: {
      const title = item.latest_unit?.title ?? "Tập mới nhất";
      const time = item.anime_last_episode_time_viewed
        ? `${item.anime_last_episode_time_viewed}`
        : undefined;
      return { icon: Play, label: title, meta: time };
    }
    case MEDIA_TYPE.MANGA: {
      const title = item.latest_unit?.title ?? "Chương mới nhất";
      const page =
        typeof item.manga_last_page_read === "number"
          ? `Trang ${item.manga_last_page_read + 1}`
          : undefined;
      return { icon: BookOpen, label: title, meta: page };
    }
    default: {
      const title = item.latest_unit?.title ?? "Chương mới nhất";
      return { icon: PauseCircle, label: title, meta: "Đang đọc" };
    }
  }
};

export const HistoryCard = ({
  item,
  className,
  resumeHref,
  onRemove,
  currentTime,
}: HistoryCardProps) => {
  const { resumeMeta, href, relativeTime } = useMemo(() => {
    const meta = getResumeMeta(item);
    const path = resumeHref ?? getMediaResumePath(item);
    let timeStr = null;
    if (item.content_updated_at && currentTime) {
      const date = new Date(item.content_updated_at);
      if (!Number.isNaN(date.getTime())) {
        timeStr = formatDistance(date, currentTime, {
          addSuffix: true,
          locale: vi,
        });
      }
    }
    return { resumeMeta: meta, href: path, relativeTime: timeStr };
  }, [item, resumeHref, currentTime]);

  return (
    <div
      className={cn(
        // OUTER CONTAINER:
        // - Rounded 20px
        // - Border 4px (Thật, không dùng overlay giả)
        // - bg-card
        "group/history-card relative flex w-full rounded-[20px] border-4 border-secondary bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        className
      )}
    >
      <Link
        href={href}
        // INNER CONTAINER:
        // Quan trọng: rounded phải là [16px] (20px outer - 4px border = 16px)
        // overflow-hidden để nội dung không tràn đè lên border
        className="flex flex-1 overflow-hidden rounded-2xl"
      >
        {/* --- LEFT: IMAGE --- */}
        <div className="relative w-28 shrink-0">
          <Image
            src={getImageUrl(item.cover_url)}
            alt={item.title}
            fill
            sizes="112px"
            // Ảnh tràn viền container con (đã bo 16px), không cần bo lại
            className="object-cover transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badge Type */}
          <Badge
            variant={getContentBadgeVariant(item.type, false)}
            className={cn(
              "absolute bottom-2 left-1/2 -translate-x-1/2 scale-90 px-2.5 py-0.5 text-[10px] shadow-sm border-0 whitespace-nowrap z-10 capitalize"
            )}
          >
            {item.type}
          </Badge>
        </div>

        {/* --- RIGHT: CONTENT --- */}
        <div className="flex flex-1 flex-col justify-between px-3 py-2.5 bg-card">
          {/* ROW 1: Title & Time */}
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-bold leading-tight text-foreground transition-colors">
              {item.title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              <span>{relativeTime ?? "Vừa xong"}</span>
            </div>
          </div>

          {/* ROW 2: Author */}
          {item.author && (
            <div className="flex items-center gap-2 py-1">
              <Avatar className="size-5 border border-border/50">
                <AvatarImage src={getImageUrl(item.author.avatar_url)} />
                <AvatarFallback className="text-[8px]">
                  {getInitials(item.author.display_name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-[11px] font-medium text-foreground/80">
                {item.author.display_name}
              </span>
            </div>
          )}

          {/* ROW 3: Resume Box */}
          <div className="relative mt-1 flex items-center justify-between rounded-lg bg-secondary/50 group-hover/history-card:bg-secondary/90 group-hover/history-card:shadow transition-all duration-200 px-2.5 py-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <resumeMeta.icon className="size-3.5 text-foreground shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="truncate text-[11px] font-bold text-foreground">
                  {resumeMeta.label}
                </span>
                {resumeMeta.meta && (
                  <span className="text-[9px] text-muted-foreground font-medium mt-0.5 truncate">
                    {resumeMeta.meta}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground/60 ml-1" />
          </div>
        </div>
      </Link>

      {/* Remove Button */}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          // Đẩy ra ngoài một chút để tạo hiệu ứng nổi
          className="absolute -right-2 -top-2 z-30 h-6 w-6 rounded-full bg-background border border-border shadow-sm text-muted-foreground transition-all scale-75"
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
};
