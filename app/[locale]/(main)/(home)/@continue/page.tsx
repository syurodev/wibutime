import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HistoryCard } from "@/features/history/components/history-card";
import { getRecentHistory } from "@/features/history/queries";
import { Link } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { BookOpen, Compass, History, Sparkles } from "lucide-react";

// Minimum cards to show for visual balance
const MIN_DISPLAY_CARDS = 4;

/**
 * Discover Card - shown when history is sparse
 * Encourages user to explore more content
 */
function DiscoverCard({ className }: { className?: string }) {
  return (
    <Link
      href="/novels"
      className={cn(
        "rounded-[20px] border-4 border-dashed border-muted-foreground/20 bg-muted/10",
        "h-full min-h-[180px]", // Fill parent height
        "flex items-center justify-center gap-4 p-6",
        "hover:border-primary/30 hover:bg-primary/5 transition-all duration-300",
        "group cursor-pointer",
        className
      )}
    >
      <div className="size-14 rounded-full bg-muted/50 group-hover:bg-primary/20 flex items-center justify-center transition-colors shrink-0">
        <Compass className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="text-left">
        <p className="text-base font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          Khám phá thêm
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Tìm truyện mới để đọc
        </p>
      </div>
    </Link>
  );
}

export default async function ContinueSection() {
  // Check authentication first
  const session = await getSession();

  // If not logged in, show login prompt placeholder
  if (!session) {
    return (
      <div className="flex flex-col gap-3 h-full">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center">
              <History className="size-3.5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm">Continue Reading</h3>
          </div>
        </div>

        {/* Login Prompt - fills remaining height */}
        <div className="relative overflow-hidden rounded-xl p-6 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="size-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                Đăng nhập để theo dõi tiến độ đọc
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Lưu lại vị trí đọc và tiếp tục từ nơi bạn dừng lại
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="size-3.5" />
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  try {
    const history = await getRecentHistory({ limit: 12 });

    if (history.length === 0) {
      return (
        <div className="flex flex-col gap-3 h-full">
          {/* Section Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                <History className="size-3.5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-sm">Continue Reading</h3>
            </div>
            <Link
              href="/novels"
              className="text-[10px] text-primary hover:underline"
            >
              Explore →
            </Link>
          </div>

          {/* Empty State - fills remaining height */}
          <div className="relative overflow-hidden rounded-xl p-6 bg-muted/30 border border-border/50 flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="size-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Chưa có lịch sử đọc</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Bắt đầu đọc truyện để thấy tiến độ ở đây!
                </p>
              </div>
              <Link
                href="/novels"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                <Compass className="size-3.5" />
                Khám phá truyện
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Calculate how many discover cards to show
    const discoverCardsCount = Math.max(0, MIN_DISPLAY_CARDS - history.length);

    // Combine all items
    const allItems = [
      ...history.map((item) => ({ type: "history" as const, data: item })),
      ...Array.from({ length: discoverCardsCount }).map((_, i) => ({
        type: "discover" as const,
        data: i,
      })),
    ];

    return (
      <div className="flex flex-col gap-3 h-full">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center">
              <History className="size-3.5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm">Continue Reading</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {history.length} items
            </span>
            <Link
              href="/history"
              className="text-[10px] text-primary hover:underline"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* History Cards Carousel - fills remaining height */}
        <div className="flex-1 min-h-0">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
            }}
            className="h-full [&>div]:h-full"
          >
            <CarouselContent className="h-full -ml-3 [&>div]:h-full">
              {allItems.map((item) => (
                <CarouselItem
                  key={
                    item.type === "history"
                      ? item.data.id
                      : `discover-${item.data}`
                  }
                  className="pl-3 basis-[300px] h-full"
                >
                  {item.type === "history" ? (
                    <HistoryCard
                      item={item.data}
                      currentTime={Date.now()}
                      className="h-full"
                    />
                  ) : (
                    <DiscoverCard className="h-full" />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Navigation buttons - positioned at edges */}
            <CarouselPrevious className="left-0 -translate-x-1/2 hidden md:flex" />
            <CarouselNext className="right-0 translate-x-1/2 hidden md:flex" />
          </Carousel>
        </div>
      </div>
    );
  } catch (error) {
    console.error("=== Continue Section - Error ===", error);
    return (
      <div className="flex flex-col gap-3 h-full">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center">
              <History className="size-3.5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm">Continue Reading</h3>
          </div>
        </div>

        {/* Error State - fills remaining height */}
        <div className="flex-1 flex items-center justify-center p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="text-center">
            <p className="text-destructive text-sm font-medium">
              Không thể tải lịch sử đọc
            </p>
            <p className="text-destructive/70 text-xs mt-1">
              Vui lòng thử lại sau
            </p>
          </div>
        </div>
      </div>
    );
  }
}
