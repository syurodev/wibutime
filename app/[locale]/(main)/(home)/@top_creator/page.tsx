import { Creator, CreatorUtils } from "@/features/creator/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { BookOpen, Eye, Pen, Sparkles, Users } from "lucide-react";
import Image from "next/image";

function RankChangeIndicator({ rankChange }: { rankChange?: number | null }) {
  const isPositive = rankChange && rankChange > 0;
  const isNegative = rankChange && rankChange < 0;

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
        isPositive && "bg-emerald-500/10 text-emerald-400",
        isNegative && "bg-rose-500/10 text-rose-400",
        !isPositive && !isNegative && "bg-muted/50 text-muted-foreground"
      )}
    >
      {isPositive && (
        <>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span>{rankChange}</span>
        </>
      )}
      {isNegative && (
        <>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span>{Math.abs(rankChange)}</span>
        </>
      )}
      {!isPositive && !isNegative && <span className="text-[10px]">—</span>}
    </div>
  );
}

export default async function TopCreatorSection() {
  const MIN_ITEMS = 3;

  // Mock data for testing UI
  const data: Partial<Creator>[] = [
    {
      id: "1",
      display_name: "Akira Toriyama",
      username: "akira_toriyama",
      avatar_url: "",
      follower_count: 125000,
      works_count: 42,
      total_views: 1500000,
      is_verified: true,
      rank_change: 2,
      popular_work_title: "Dragon Ball Z",
    },
    {
      id: "2",
      display_name: "Eiichiro Oda",
      username: "oda_sensei",
      avatar_url: "",
      follower_count: 89000,
      works_count: 15,
      total_views: 980000,
      is_verified: true,
      rank_change: -1,
      popular_work_title: "One Piece",
    },
    {
      id: "3",
      display_name: "Masashi Kishimoto",
      username: "kishimoto_m",
      avatar_url: undefined,
      follower_count: 67000,
      works_count: 28,
      total_views: 750000,
      is_verified: false,
      rank_change: 1,
      popular_work_title: "Naruto Shippuden",
    },
  ];

  // Uncomment to use real API:
  // const data: Creator[] = await getTopCreators({
  //   limit: MIN_ITEMS,
  //   include_rank_change: true,
  //   period: "week",
  // });

  // Ensure we always have 5 items, pad with null for placeholders
  const displayData: (Partial<Creator> | null)[] = [
    ...data,
    ...new Array(Math.max(0, MIN_ITEMS - data.length)).fill(null),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="size-3.5 text-amber-500" />
          </div>
          <h3 className="font-semibold text-sm">Top Creators</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            This Week
          </span>
          <Link
            href="/creators"
            className="text-[10px] text-primary hover:underline"
          >
            See All →
          </Link>
        </div>
      </div>
      {displayData.map((x, index) => {
        const rank = index + 1;
        const isPlaceholder = x === null;

        // Placeholder skeleton item
        if (isPlaceholder) {
          return (
            <div
              className="relative overflow-hidden rounded-xl p-3 bg-background/80 backdrop-blur-sm border border-white/5"
              key={`placeholder-${index}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm bg-muted/30 text-muted-foreground/50 mt-0.5">
                  {rank}
                </div>
                <div className="size-10 rounded-full bg-muted/30 animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  {/* Name & Username */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-muted/20 rounded animate-pulse mt-1" />
                    </div>
                    <div className="h-5 w-8 bg-muted/20 rounded-full" />
                  </div>
                  {/* Popular Work */}
                  <div className="mt-1 h-3 w-28 bg-muted/20 rounded animate-pulse" />
                  {/* Stats */}
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-3 w-12 bg-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            className={cn(
              "group relative overflow-hidden rounded-xl p-3",
              "bg-background/80",
              "backdrop-blur-sm border border-white/5",
              "hover:border-white/10",
              "transition-all duration-300 ease-out cursor-pointer"
            )}
            key={x.id}
          >
            <div className="flex items-start gap-3">
              {/* Rank Number */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm mt-0.5",
                  rank === 1 &&
                    "bg-amber-500 text-white shadow-lg shadow-orange-500/30",
                  rank === 2 &&
                    "bg-slate-400 text-slate-700 shadow-lg shadow-slate-400/30",
                  rank === 3 &&
                    "bg-amber-700 text-amber-100 shadow-lg shadow-amber-600/30",
                  rank > 3 && "bg-muted/50 text-muted-foreground"
                )}
              >
                {rank}
              </div>

              {/* Avatar */}
              <div className="relative size-10 shrink-0">
                {x.avatar_url ? (
                  <Image
                    src={x.avatar_url}
                    alt={x.display_name || "Creator"}
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="size-full rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground text-sm font-semibold">
                    {(x.display_name || "?")[0].toUpperCase()}
                  </div>
                )}
                {x.is_verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="size-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex-1 min-w-0">
                {/* Name & Rank Change */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-sm truncate block group-hover:text-primary transition-colors">
                      {x.display_name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      @{x.username}
                    </span>
                  </div>
                  <RankChangeIndicator rankChange={x.rank_change} />
                </div>

                {/* Popular Work */}
                {x.popular_work_title && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <BookOpen className="size-3 shrink-0" />
                    <span className="truncate">{x.popular_work_title}</span>
                  </div>
                )}

                {/* Stats Row */}
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{CreatorUtils.formatViews(x.total_views ?? 0)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>
                      {CreatorUtils.formatFollowers(x.follower_count ?? 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Pen className="size-3" />
                    <span>{x.works_count ?? 0} works</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
