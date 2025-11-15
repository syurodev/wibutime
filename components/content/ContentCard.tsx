import { Link } from "@/i18n/routing";
import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import { getImageUrlWithDefault } from "@/lib/utils/get-image-url-with-default";
import { getInitials } from "@/lib/utils/get-initials";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export interface ContentCardProps {
  readonly series: MediaSeries;
  readonly className?: string;
}

export const ContentCard = memo(function ContentCard({
  series,
  className,
}: ContentCardProps) {
  return (
    <Link
      href={`/novels/${series.slug}`}
      // Thêm transform-gpu để ép GPU xử lý layout
      className={cn(className, "block transform-gpu")}
    >
      <AspectRatio
        ratio={4 / 6}
        className="rounded-[20px] relative bg-secondary shadow-sm isolate overflow-hidden group"
      >
        {/* Badge */}
        <Badge
          className={cn(
            "absolute z-40 top-3 right-3 capitalize shadow-md pointer-events-none px-2.5 py-0.5 text-[10px]",
            getContentBg({ type: series.type, blur: true })
          )}
        >
          {series.type}
        </Badge>

        {/* Viền Border */}
        <div className="absolute inset-0 z-50 rounded-[20px] border-4 border-secondary pointer-events-none" />

        {/* Content Wrapper */}
        <div className="absolute inset-px z-0 rounded-[19px] overflow-hidden bg-secondary">
          {/* 1. IMAGE LAYER */}
          <Image
            src={series.cover_url || "/placeholder-cover.svg"}
            alt={series.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            // Mobile: Tắt hover scale để scroll mượt hơn
            // Desktop (md:): Bật hover scale
            className="object-cover transition-transform duration-500 md:group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* --- OPTIMIZATION LOGIC START --- */}

          {/* 2. MOBILE OVERLAY (HIỆU NĂNG CAO) 
              - Chỉ hiện trên màn hình nhỏ (< md)
              - Dùng gradient đơn giản, không blur, không mask.
              - from-black/95: Đủ đậm để text trắng dễ đọc.
          */}
          <div
            className="absolute inset-0 z-10 pointer-events-none md:hidden
            bg-gradient-to-t from-black/95 via-black/40 to-transparent"
          />

          {/* 3. DESKTOP OVERLAY (VISUAL CAO CẤP - GIỮ NGUYÊN NHƯ CŨ) 
              - Chỉ hiện trên màn hình lớn (hidden md:block)
              - Giữ nguyên Blur, Mask Image, Gradient Protection
          */}
          <>
            {/* Desktop Blur Layer */}
            <div
              className="hidden md:block absolute bottom-0 left-0 w-full z-10 pointer-events-none 
                h-[65%] backdrop-blur-3xl translate-z-0"
              style={{
                maskImage:
                  "linear-gradient(to top, black 30%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 30%, transparent 100%)",
              }}
            />

            {/* Desktop Gradient Protection Layer */}
            <div
              className="hidden md:block absolute bottom-0 left-0 w-full h-[50%] z-15 pointer-events-none
              bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />
          </>

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
                    src={getImageUrlWithDefault(
                      series.author.avatar_url,
                      "user-avatar"
                    )}
                    alt={series.author.username}
                    loading="lazy"
                  />
                  <AvatarFallback className="text-[9px] text-foreground">
                    {getInitials(series.author.display_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium truncate text-white/90 text-shadow-sm">
                  {series.author.display_name}
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
  );
});
