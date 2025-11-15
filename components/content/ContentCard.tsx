import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import { LazyBasicStaticEditorView } from "../editor/lazy-basic-static-editor-view";

export interface ContentCardProps {
  readonly series: MediaSeries;
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
            src={series.cover_url || "/placeholder-cover.svg"}
            alt={series.title}
            fill
            className="object-cover"
          />
        </AspectRatio>
        <div className="p-2 flex flex-col justify-between h-full">
          <p className="text-sm font-semibold line-clamp-1">{series.title}</p>
          {showDescription && (
            <LazyBasicStaticEditorView content={series.description} maxLines={2} />
          )}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex text-xs items-center justify-center w-fit gap-1">
              <Eye className="size-4 text-sky-500" />{" "}
              <span>{formatNumberAbbreviated(series.views)}</span>
            </div>
            <div className="flex text-xs items-center justify-center w-fit gap-1">
              <Heart className="size-4 text-rose-500" />
              <span>{formatNumberAbbreviated(series.favorites)}</span>
            </div>
          </div>
        </div>
      </AspectRatio>
    </Link>
  );
}
