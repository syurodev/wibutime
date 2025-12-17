"use client";

import { MediaSeries } from "@/features/content";
import { useUiPreferences } from "@/hooks/use-user-settings";
import { Link } from "@/i18n/routing";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getContentBadgeVariant } from "@/lib/utils/get-content-bg";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { Eye, Heart } from "lucide-react";
import { memo } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../ui/image-with-fallback";

export interface ContentCardProps {
  readonly series: MediaSeries;
  readonly className?: string;
}

export const ContentCard = memo(function ContentCard({
  series,
  className,
}: ContentCardProps) {
  const { preferences } = useUiPreferences();
  // Use reduced visuals when glass_effect is 'reduce'
  const reduceBlur = preferences.glass_effect === "reduce";

  return (
    <div className="rounded-[20px] border-4 border-secondary bg-secondary shadow-sm group transition-all duration-300 hover:shadow-lg hover:border-primary/30 transform-gpu">
      <Link href={`/novels/${series.slug}`} className={cn(className, "block")}>
        <AspectRatio
          ratio={4 / 6}
          className="relative isolate overflow-hidden rounded-2xl"
        >
          {/* Badge */}
          <Badge
            variant={getContentBadgeVariant(series.type, true)}
            className={cn(
              "absolute z-40 top-3 right-3 capitalize shadow-md pointer-events-none px-2.5 py-0.5 text-[10px]"
            )}
          >
            {series.type}
          </Badge>

          {/* Content Wrapper */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* 1. IMAGE LAYER */}
            <ImageWithFallback
              src={getImageUrl(series.cover_url)}
              alt={series.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              // Mobile: Tắt hover scale để scroll mượt hơn
              // Desktop (md:): Bật hover scale
              className="object-cover transition-transform duration-500 md:group-hover:scale-105"
              loading="lazy"
              decoding="async"
              fallback={getInitials(series.title)}
            />

            {/* --- OPTIMIZATION LOGIC START --- */}

            {/* REDUCED OVERLAY (HIỆU NĂNG CAO)
              - Shows when glass_effect = 'reduce'
              - Dùng gradient đơn giản, không blur, không mask.
              - from-black/95: Đủ đậm để text trắng dễ đọc.
          */}
            {reduceBlur && (
              <div
                className="absolute inset-0 z-10 pointer-events-none
              bg-linear-to-t from-black/95 via-black/40 to-transparent"
              />
            )}

            {/* FULL QUALITY OVERLAY (VISUAL CAO CẤP)
              - Shows when glass_effect = 'normal' or 'liquid'
              - Giữ nguyên Blur, Mask Image, Gradient Protection
          */}
            {!reduceBlur && (
              <>
                {/* Blur Layer */}
                <div
                  className="absolute bottom-0 left-0 w-full z-10 pointer-events-none
                  h-[65%] backdrop-blur-3xl translate-z-0"
                  style={{
                    maskImage:
                      "linear-gradient(to top, black 30%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, black 30%, transparent 100%)",
                  }}
                />

                {/* Gradient Protection Layer */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[50%] z-15 pointer-events-none
                bg-linear-to-t from-black/80 via-black/20 to-transparent"
                />
              </>
            )}

            {/* --- OPTIMIZATION LOGIC END --- */}

            {/* TEXT CONTENT LAYER */}
            <div className="px-3.5 pb-3.5 flex flex-col justify-end z-20 h-full absolute w-full bottom-0">
              <div className="mb-1.5">
                <h3 className="text-sm font-bold line-clamp-1 leading-tight text-white text-shadow-sm">
                  {series.title}
                </h3>
                <p className="text-xs font-medium line-clamp-1 mt-0.5 text-white/90 text-shadow-sm">
                  {series.latest_chapter?.title || "Chapter 0"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 max-w-[60%]">
                  <Avatar className="size-6 shrink-0 ring-1 ring-white/30">
                    <AvatarImage
                      src={getImageUrl(series.owner.avatar_url)}
                      alt={series.owner.username}
                      loading="lazy"
                    />
                    <AvatarFallback className="text-[9px] text-foreground">
                      {getInitials(series.owner.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-medium truncate text-white/90 text-shadow-sm">
                    {series.owner.display_name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-white/80">
                  <div className="flex items-center gap-1 text-[11px] text-shadow-sm">
                    <Eye className="size-3.5" />
                    <span>{formatNumberAbbreviated(series.views)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-shadow-sm">
                    <Heart className="size-3.5" />
                    <span>{formatNumberAbbreviated(series.favorites)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AspectRatio>
      </Link>
    </div>
  );
});
