import { getTopOrganizations } from "@/features/organization/queries";
import { Organization } from "@/features/organization/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { BookCheck, Building2, Sparkles, Users } from "lucide-react";
import Image from "next/image";

function RankChangeIndicator({ rankChange }: { rankChange?: number | null }) {
  const isPositive = rankChange != null && rankChange > 0;
  const isNegative = rankChange != null && rankChange < 0;

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

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default async function TopOrganizationSection() {
  const MIN_ITEMS = 3;

  const data: Organization[] = await getTopOrganizations({
    limit: MIN_ITEMS,
    include_rank_change: true,
    period: "week",
  });

  // Ensure we always have MIN_ITEMS items, pad with null for placeholders
  const displayData: (Partial<Organization> | null)[] = [
    ...data,
    ...new Array(Math.max(0, MIN_ITEMS - data.length)).fill(null),
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-violet-500/20 flex items-center justify-center">
            <Building2 className="size-3.5 text-violet-500" />
          </div>
          <h3 className="font-semibold text-sm">Top Groups</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            This Week
          </span>
          <Link
            href="/organizations"
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
              className="relative overflow-hidden rounded-xl p-3 bg-background/80 backdrop-blur-sm border border-dashed border-white/10"
              key={`placeholder-${index}`}
            >
              <div className="flex items-start gap-3">
                {/* Rank Number */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm bg-muted/30 text-muted-foreground/50 mt-0.5">
                  {rank}
                </div>

                {/* Avatar placeholder */}
                <div className="size-10 shrink-0 rounded-lg bg-muted/30 flex items-center justify-center">
                  <Building2 className="size-5 text-muted-foreground/30" />
                </div>

                {/* Content skeleton */}
                <div className="flex-1 min-w-0">
                  {/* Name & Slug */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="h-4 w-28 bg-muted/30 rounded" />
                      <div className="h-3 w-20 bg-muted/20 rounded mt-1" />
                    </div>
                    <div className="h-5 w-8 bg-muted/20 rounded-full" />
                  </div>
                  {/* Description */}
                  <div className="mt-1.5 h-3 w-32 bg-muted/20 rounded" />
                  {/* Stats */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-3 w-14 bg-muted/20 rounded" />
                    <div className="h-3 w-16 bg-muted/20 rounded" />
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
                    alt={x.name || "Organization"}
                    fill
                    className="rounded-lg object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="size-full rounded-lg bg-linear-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center text-violet-300 text-sm font-semibold">
                    {(x.name || "?")[0].toUpperCase()}
                  </div>
                )}
                {/* Recruiting Badge */}
                {x.is_recruiting && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="size-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Organization Info */}
              <div className="flex-1 min-w-0">
                {/* Name & Rank Change */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-sm truncate block group-hover:text-primary transition-colors">
                      {x.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      @{x.slug}
                    </span>
                  </div>
                  <RankChangeIndicator rankChange={x.rank_change} />
                </div>

                {/* Description snippet */}
                {x.description?.text && (
                  <div className="mt-1 text-[10px] text-muted-foreground truncate">
                    {x.description.text}
                  </div>
                )}

                {/* Stats Row */}
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>{formatNumber(x.member_count ?? 0)} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookCheck className="size-3" />
                    <span>
                      {formatNumber(x.completed_translations ?? 0)} works
                    </span>
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
