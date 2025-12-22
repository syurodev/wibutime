import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getTopMedia } from "@/features/media/queries";
import { MediaSeriesWithRank } from "@/features/media/types";
import { Link } from "@/i18n/routing";
import { MEDIA_TYPE } from "@/lib/constants/default";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import {
  BookOpen,
  ChevronRight,
  Eye,
  Heart,
  Sparkles,
  TrendingUp,
  Tv,
} from "lucide-react";

// Content type configs
const contentTypes = [
  {
    type: MEDIA_TYPE.NOVEL,
    label: "Novel",
    href: "/novels",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    type: MEDIA_TYPE.ANIME,
    label: "Anime",
    href: "/anime",
    icon: Tv,
    color: "text-rose-500",
    bgColor: "bg-rose-500/20",
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
  },
  {
    type: MEDIA_TYPE.MANGA,
    label: "Manga",
    href: "/manga",
    icon: BookOpen,
    color: "text-violet-500",
    bgColor: "bg-violet-500/20",
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
  },
];

function formatViews(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

type ContentTypeConfig = (typeof contentTypes)[number];

function TopItemCard({
  item,
  config,
}: {
  item: MediaSeriesWithRank;
  config: ContentTypeConfig;
}) {
  const TypeIcon = config.icon;

  return (
    <Link
      href={`/${item.type}s/${item.slug}`}
      className={cn(
        "group relative flex gap-3 p-3 rounded-lg",
        "bg-background/50 border border-white/5",
        "hover:border-white/10 hover:bg-background/80",
        "transition-all duration-300"
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-50",
          `bg-linear-to-r ${config.gradient}`
        )}
      />

      {/* Cover Image */}
      <div className="relative w-14 h-[72px] shrink-0 rounded-md overflow-hidden">
        {item.cover_url ? (
          <ImageWithFallback
            src={getImageUrl(item.cover_url)}
            alt={item.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-muted/50 flex items-center justify-center text-muted-foreground">
            <TypeIcon className="size-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex-1 min-w-0 flex flex-col justify-between">
        {/* Title + Rank Badge */}
        <div className="flex items-start gap-2">
          <h4 className="font-bold text-xs line-clamp-1 group-hover:text-primary transition-colors flex-1">
            {item.title}
          </h4>
          {item.current_rank && (
            <span className="shrink-0 px-1 py-0.5 text-[8px] font-medium rounded bg-yellow-500/20 text-yellow-500">
              #{item.current_rank}
            </span>
          )}
        </div>

        {/* Owner */}
        {item.owner && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Avatar className="size-3.5">
              <AvatarImage src={getImageUrl(item.owner.avatar_url)} />
              <AvatarFallback className="text-[6px]">
                {getInitials(item.owner.display_name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[9px] text-muted-foreground truncate">
              {item.owner.display_name}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground mt-0.5">
          <div className="flex items-center gap-0.5">
            <Eye className="size-2.5" />
            <span>{formatViews(item.views)}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Heart className="size-2.5" />
            <span>{formatViews(item.favorites)}</span>
          </div>
          <div className="flex items-center gap-0.5 text-yellow-500">
            <Sparkles className="size-2.5" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function TopViewSection() {
  const topMedia = await getTopMedia({ period: "week", offset: 0, limit: 2 });

  // Map API data to content types (arrays)
  const mediaMap: Record<string, MediaSeriesWithRank[]> = {
    [MEDIA_TYPE.MANGA]: topMedia.manga,
    [MEDIA_TYPE.NOVEL]: topMedia.novel,
    [MEDIA_TYPE.ANIME]: topMedia.anime,
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-rose-500/20 flex items-center justify-center">
            <TrendingUp className="size-3.5 text-rose-500" />
          </div>
          <h3 className="font-semibold text-sm">Top Views</h3>
        </div>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          This Week
        </span>
      </div>

      {/* Content Types with Items */}
      <div className="flex-1 flex flex-col justify-between gap-4 md:gap-5">
        {contentTypes.map((config) => {
          const items = mediaMap[config.type];
          const TypeIcon = config.icon;

          return (
            <div key={config.type} className="flex flex-col gap-2">
              {/* Sub Header - Links to type page */}
              <Link
                href={config.href}
                className="group/header flex items-center justify-between px-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-5 rounded flex items-center justify-center",
                      config.bgColor
                    )}
                  >
                    <TypeIcon className={cn("size-3", config.color)} />
                  </div>
                  <span className="font-medium text-xs md:text-sm">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] md:text-xs text-muted-foreground group-hover/header:text-primary transition-colors">
                  <span>Xem tất cả</span>
                  <ChevronRight className="size-3 md:size-4" />
                </div>
              </Link>

              {/* Top Items - Always show 2 slots per type */}
              <div className="flex flex-col gap-2">
                {/* Render actual items */}
                {items?.map((item) => (
                  <TopItemCard key={item.id} item={item} config={config} />
                ))}
                {/* Fill remaining slots with placeholders */}
                {Array.from({
                  length: Math.max(0, 2 - (items?.length || 0)),
                }).map((_, idx) => (
                  <div
                    key={`placeholder-${config.type}-${idx}`}
                    className={cn(
                      "relative flex gap-3 p-3 rounded-lg",
                      "bg-background/50 border border-dashed border-white/10"
                    )}
                  >
                    {/* Placeholder Cover */}
                    <div className="relative w-14 h-[72px] shrink-0 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
                      <TypeIcon className="size-6 text-muted-foreground/50" />
                    </div>

                    {/* Placeholder Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="h-3 w-3/4 bg-muted/30 rounded" />
                      <div className="h-2.5 w-1/2 bg-muted/20 rounded mt-1" />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-8 bg-muted/20 rounded" />
                        <div className="h-2 w-6 bg-muted/20 rounded" />
                        <div className="h-2 w-6 bg-muted/20 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
