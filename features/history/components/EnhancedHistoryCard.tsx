"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HistoryMedia } from "@/features/history/types/history-content";
import { Link } from "@/i18n/routing";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { CONTENT_TYPE } from "@/lib/constants/default";
import { cn } from "@/lib/utils";
import {
  getContentBadgeVariant,
  getContentProgressGradient,
} from "@/lib/utils/get-content-bg";
import { getImageUrlWithDefault } from "@/lib/utils/get-image-url-with-default";
import { getInitials } from "@/lib/utils/get-initials";
import { getMediaResumePath } from "@/lib/utils/get-media-resume-path";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  LucideIcon,
  PauseCircle,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

export interface EnhancedHistoryCardProps {
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
  currentUnit?: number;
};

const getResumeMeta = (item: HistoryMedia): ResumeMeta => {
  switch (item.type) {
    case CONTENT_TYPE.ANIME: {
      const title = item.latest_unit?.title ?? "Tập mới nhất";
      const time = item.anime_last_episode_time_viewed
        ? `${item.anime_last_episode_time_viewed}`
        : undefined;
      // Extract episode number from latest_unit title if possible
      const match = item.latest_unit?.title?.match(/(\d+)/);
      const currentUnit = match ? parseInt(match[1], 10) : undefined;
      return { icon: Play, label: title, meta: time, currentUnit };
    }
    case CONTENT_TYPE.MANGA: {
      const title = item.latest_unit?.title ?? "Chương mới nhất";
      const page =
        typeof item.manga_last_page_read === "number"
          ? `Trang ${item.manga_last_page_read + 1}`
          : undefined;
      const match = item.latest_unit?.title?.match(/(\d+)/);
      const currentUnit = match ? parseInt(match[1], 10) : undefined;
      return { icon: BookOpen, label: title, meta: page, currentUnit };
    }
    default: {
      const title = item.latest_unit?.title ?? "Chương mới nhất";
      const match = item.latest_unit?.title?.match(/(\d+)/);
      const currentUnit = match ? parseInt(match[1], 10) : undefined;
      return { icon: PauseCircle, label: title, meta: "Đang đọc", currentUnit };
    }
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-blue-500/90 text-white border-0";
    case "ongoing":
      return "bg-green-500/90 text-white border-0";
    case "hiatus":
      return "bg-yellow-500/90 text-white border-0";
    case "cancelled":
      return "bg-red-500/90 text-white border-0";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusLabel = (status: string, t: any) => {
  switch (status) {
    case "completed":
      return t("status.completed");
    case "ongoing":
      return t("status.ongoing");
    case "hiatus":
      return t("status.hiatus");
    case "cancelled":
      return t("status.cancelled");
    default:
      return status;
  }
};

export const EnhancedHistoryCard = ({
  item,
  className,
  resumeHref,
  onRemove,
  currentTime,
}: EnhancedHistoryCardProps) => {
  const t = useTranslations("history");

  const { resumeMeta, href, relativeTime, hasNewUpdate, progressPercentage } =
    useMemo(() => {
      const meta = getResumeMeta(item);
      const path = resumeHref ?? getMediaResumePath(item);

      let timeStr = null;
      if (item.last_viewed_at && currentTime) {
        const date = new Date(item.last_viewed_at);
        if (!Number.isNaN(date.getTime())) {
          timeStr = formatDistance(date, currentTime, {
            addSuffix: true,
            locale: vi,
          });
        }
      }

      // Check if content has been updated since last view
      const hasUpdate =
        item.content_updated_at &&
        item.last_viewed_at &&
        new Date(item.content_updated_at) > new Date(item.last_viewed_at);

      // Calculate progress percentage if not provided
      let progress = item.user_progress_percentage;
      if (
        progress === undefined &&
        item.total_units &&
        meta.currentUnit !== undefined
      ) {
        progress = Math.min(
          Math.round((meta.currentUnit / item.total_units) * 100),
          100
        );
      }

      return {
        resumeMeta: meta,
        href: path,
        relativeTime: timeStr,
        hasNewUpdate: hasUpdate,
        progressPercentage: progress,
      };
    }, [item, resumeHref, currentTime]);

  return (
    <div
      className={cn(
        // Consistent styling with other cards
        "group/history-card relative flex w-full rounded-[20px] border-4 border-secondary bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        "flex-row", // Always horizontal
        className
      )}
    >
      <Link
        href={href}
        className="flex flex-1 overflow-hidden rounded-2xl flex-row"
      >
        {/* IMAGE SECTION - Larger fixed width */}
        <div className="relative shrink-0 w-[170px] h-full">
          <Image
            src={getImageUrlWithDefault(item.cover_url, "content-cover")}
            alt={item.title}
            fill
            sizes="170px"
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Type Badge */}
          <Badge
            variant={getContentBadgeVariant(item.type, true)}
            className={cn(
              "absolute bottom-3 left-1/2 -translate-x-1/2 z-30",
              "px-2.5 py-0.5 text-[10px] shadow-lg border-0 capitalize"
            )}
          >
            {item.type}
          </Badge>

          {/* New Update Badge - Only show if content updated since last view */}
          {hasNewUpdate && (
            <Badge className="absolute top-3 left-3 z-30 px-2 py-0.5 text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
              <Sparkles className="size-2.5 mr-0.5" />
              {t("newUpdate")}
            </Badge>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="flex flex-1 flex-col justify-between p-4 bg-card min-h-[200px]">
          {/* Title & Rating Row */}
          <div className="min-w-0 mb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="flex-1 line-clamp-2 md:line-clamp-2 text-sm md:text-base font-bold leading-tight text-foreground">
                {item.title}
              </h3>
              {item.rating > 0 && (
                <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-sm">
                  <span className="text-amber-500 text-xs md:text-sm">⭐</span>
                  <span className="text-[11px] md:text-xs font-bold text-amber-500">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Status & Time */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge
                className={cn(
                  "text-[9px] md:text-[10px] px-1.5 py-0 h-5",
                  getStatusColor(item.status)
                )}
              >
                {getStatusLabel(item.status, t)}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] md:text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                <span>{relativeTime ?? "Vừa xong"}</span>
              </div>
            </div>
          </div>

          {/* Genres */}
          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.genres.slice(0, 3).map((genre) => (
                <Badge
                  key={genre.id}
                  variant="outline"
                  className="text-[9px] md:text-[10px] px-1.5 py-0 h-5 bg-secondary/50 backdrop-blur-sm border-border/50"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {progressPercentage !== undefined && progressPercentage > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground">
                  {t("progress")}
                </span>
                <span className="text-[10px] md:text-[11px] font-bold text-foreground">
                  {resumeMeta.currentUnit && item.total_units
                    ? `${resumeMeta.currentUnit}/${item.total_units}`
                    : `${progressPercentage}%`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                    getContentProgressGradient(item.type)
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Row */}
          {(item.views > 0 || item.favorites > 0) && (
            <div className="flex items-center gap-3 mb-2 text-[10px] md:text-[11px] text-muted-foreground">
              {item.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="size-3 md:size-3.5" />
                  <span>{formatNumberAbbreviated(item.views)}</span>
                </div>
              )}
              {item.favorites > 0 && (
                <div className="flex items-center gap-1">
                  <Heart className="size-3 md:size-3.5" />
                  <span>{formatNumberAbbreviated(item.favorites)}</span>
                </div>
              )}
            </div>
          )}

          {/* Author */}
          {item.author && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="size-5 md:size-6 border border-border/50">
                <AvatarImage
                  src={getImageUrlWithDefault(
                    item.author.avatar_url,
                    "user-avatar"
                  )}
                />
                <AvatarFallback className="text-[8px] md:text-[9px]">
                  {getInitials(item.author.display_name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-[11px] md:text-xs font-medium text-foreground/80">
                {item.author.display_name}
              </span>
            </div>
          )}

          {/* Resume Box */}
          <div className="relative flex items-center justify-between rounded-lg bg-gradient-to-r from-secondary/60 to-secondary/40 backdrop-blur-sm group-hover/history-card:from-secondary/80 group-hover/history-card:to-secondary/60 group-hover/history-card:shadow-md transition-all duration-200 px-3 py-2 border border-border/30">
            <div className="flex items-center gap-2 min-w-0">
              <resumeMeta.icon className="size-4 text-foreground shrink-0" />
              <div className="flex flex-col leading-none min-w-0">
                <span className="truncate text-[11px] md:text-xs font-bold text-foreground">
                  {resumeMeta.label}
                </span>
                {resumeMeta.meta && (
                  <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
                    {resumeMeta.meta}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground/60 ml-1 shrink-0 group-hover/history-card:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Remove Button */}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2 z-40 h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all scale-90 hover:scale-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item);
          }}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
};
