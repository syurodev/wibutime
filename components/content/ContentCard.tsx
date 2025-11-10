import { CONTENT_TYPE } from "@/lib/constants/default";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";

/**
 * Plain object type for series data (for Client Component)
 */
export interface SeriesData {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  type: CONTENT_TYPE;
  formatted_views: string;
  formatted_favorites: string;
  is_trending: boolean;
}

export interface ContentCardProps {
  readonly series: SeriesData;
  readonly showDescription?: boolean;
  readonly showContentType?: boolean;
  readonly className?: string;
}

export function ContentCard({
  series,
  showDescription = true,
  showContentType = false,
  className,
}: ContentCardProps) {
  return (
    <Link href={`/series/${series.slug}`} className={cn(className)}>
      <AspectRatio
        ratio={4 / 6}
        className="rounded-3xl overflow-hidden flex flex-col p-2 shadow bg-secondary"
      >
        <AspectRatio
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
            src={series.cover_url}
            alt={series.title}
            fill
            className="object-cover"
          />
        </AspectRatio>
        <div className="p-2 flex flex-col justify-between h-full">
          <p className="text-sm font-semibold line-clamp-1">{series.title}</p>
          {showDescription && (
            <p className="line-clamp-2 text-xs text-secondary-foreground">
              {series.description}
            </p>
          )}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex text-xs items-center justify-center w-fit gap-1">
              <Eye className="size-4 text-sky-500" />{" "}
              <span>{series.formatted_views}</span>
            </div>
            <div className="flex text-xs items-center justify-center w-fit gap-1">
              <Heart className="size-4 text-rose-500" />
              <span>{series.formatted_favorites}</span>
            </div>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}
