import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import { getImageUrlWithDefault } from "@/lib/utils/get-image-url-with-default";
import { getInitials } from "@/lib/utils/get-initials";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    <Link href={`/series/${series.slug}`} className={cn(className, "block")}>
      <AspectRatio
        ratio={4 / 6}
        className="rounded-[20px] relative bg-secondary shadow-sm isolate group transform-gpu overflow-hidden"
      >
        <Badge
          className={cn(
            "absolute z-40 top-3 right-3 capitalize shadow-md pointer-events-none px-2.5 py-0.5 text-[10px]",
            getContentBg({ type: series.type, blur: true })
          )}
        >
          {series.type}
        </Badge>

        <div className="absolute inset-0 z-50 rounded-[20px] border-4 border-secondary pointer-events-none" />

        <div className="absolute inset-px z-0 rounded-[19px] overflow-hidden bg-secondary">
          <Image
            src={series.cover_url || "/placeholder-cover.svg"}
            alt={series.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* === GIẢI PHÁP: GRADIENT PROTECTION === */}
          {/* 1. Lớp Blur giữ nguyên hiệu ứng mờ ảo */}
          <div
            className="absolute bottom-0 left-0 w-full z-10 pointer-events-none 
              h-[65%] backdrop-blur-3xl translate-z-0"
            style={{
              maskImage: "linear-gradient(to top, black 30%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 30%, transparent 100%)",
            }}
          />

          {/* 2. Lớp Gradient Đen Mỏng nằm đè lên Blur nhưng dưới Chữ 
             - from-black/80: Đáy đen 80% (đủ để chữ trắng nổi bần bật)
             - via-black/40: Giữa đen 40%
             - to-transparent: Trên cùng trong suốt
             => Kết quả: Chữ luôn đọc được kể cả khi ảnh bìa là màu trắng.
          */}
          <div
            className="absolute bottom-0 left-0 w-full h-[50%] z-15 pointer-events-none
            bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          />

          {/* TEXT CONTENT */}
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
                      series.user.avatar_url,
                      "user-avatar"
                    )}
                    alt={series.user.username}
                  />
                  <AvatarFallback className="text-[9px] text-foreground">
                    {getInitials(series.user.display_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium truncate text-white/90 text-shadow-sm">
                  {series.user.display_name}
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
