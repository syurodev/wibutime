import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getImageUrlWithDefault } from "@/lib/utils/get-image-url-with-default";
import { getInitials } from "@/lib/utils/get-initials";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface ContentCardProps {
  readonly series: MediaSeries;
  readonly className?: string;
}

/**
 * ContentCard Component
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 * when parent components re-render
 */
export const ContentCard = memo(function ContentCard({
  series,
  className,
}: ContentCardProps) {
  return (
    <Link href={`/series/${series.slug}`} className={cn(className)}>
      <AspectRatio
        ratio={4 / 6}
        className="rounded-3xl overflow-hidden flex flex-col shadow bg-secondary relative border-4"
      >
        {/* <AspectRatio
          ratio={1}
          className="relative rounded-2xl overflow-hidden shadow"
        >
          {showContentType && (
            <Badge
              className={cn(
                "absolute z-40 top-2 left-2 text-secondary-foreground capitalize",
                getContentBg({ type: series.type, blur: true })
              )}
            >
              {series.type}
            </Badge>
          )}
          <Image
            src={series.cover_url || "/placeholder-cover.svg"}
            alt={series.title}
            fill
            className="object-cover"
          />
        </AspectRatio> */}
        <Image
          src={series.cover_url || "/placeholder-cover.svg"}
          alt={series.title}
          fill
          className="object-cover"
        />
        <div className="p-2 flex flex-col justify-between z-4 h-fit absolute w-full bottom-0 bg-background/60 rounded-t-2xl backdrop-blur-md border-0">
          <p className="text-sm font-semibold line-clamp-1">{series.title}</p>
          <p className="text-sm line-clamp-1">{series.latest_chapter?.title}</p>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Avatar className="size-7">
                <AvatarImage
                  src={getImageUrlWithDefault(
                    series.user.avatar_url,
                    "user-avatar"
                  )}
                />
                <AvatarFallback>
                  {getInitials(
                    series.user.display_name || series.user.username
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-normal">
                  {series.user.display_name}
                </span>
                <span className="text-xs text-secondary-foreground">
                  @{series.user.username}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between flex-1">
              <div className="flex text-xs items-center justify-center w-fit gap-1">
                <span>{formatNumberAbbreviated(series.views)}</span>
                <Eye className="size-4" />
              </div>
              <div className="flex text-xs items-center justify-center w-fit gap-1">
                <span>{formatNumberAbbreviated(series.favorites)}</span>
                <Heart className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
});
