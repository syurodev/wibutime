"use client";

/**
 * TopNovelsTable Component
 * Displays a table of top performing novels with key metrics
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TopNovel } from "@/features/novel/types";
import { Link } from "@/i18n/routing";
import { getRelativeTime } from "@/lib/utils/date-ranges";
import { formatNumber, formatRating } from "@/lib/utils/format-number";
import { ArrowUpRight, Eye, Heart, Star } from "lucide-react";

export interface TopNovelsTableProps {
  readonly data: TopNovel[];
  readonly title?: string;
  readonly viewAllHref?: string;
  readonly isLoading?: boolean;
  readonly ownerType: "user" | "tenant";
}

const STATUS_LABELS = {
  draft: { label: "Nháp", variant: "secondary" as const },
  ongoing: { label: "Đang tiến hành", variant: "default" as const },
  completed: { label: "Hoàn thành", variant: "outline" as const },
  hiatus: { label: "Tạm ngưng", variant: "secondary" as const },
  dropped: { label: "Đã bỏ", variant: "destructive" as const },
};

export function TopNovelsTable({
  data,
  title = "Novel nổi bật",
  viewAllHref,
  isLoading,
  ownerType,
}: TopNovelsTableProps) {
  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Chưa có novel nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const baseHref = ownerType === "user" ? "/dashboard/novels" : undefined;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          {viewAllHref && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={viewAllHref}>
                Xem tất cả
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Tiêu đề</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Lượt xem</TableHead>
                <TableHead className="text-right">Yêu thích</TableHead>
                <TableHead className="text-right">Đánh giá</TableHead>
                <TableHead className="text-right">Chương</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((novel, index) => {
                const statusConfig = STATUS_LABELS[novel.status];
                const href = baseHref ? `${baseHref}/${novel.id}/volumes` : "#";

                return (
                  <TableRow key={novel.id} className="group">
                    <TableCell>
                      <Link
                        href={href}
                        className="flex items-start gap-3 hover:underline"
                      >
                        <span className="text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium leading-tight line-clamp-2">
                            {novel.title}
                          </p>
                          {novel.lastChapterAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {getRelativeTime(novel.lastChapterAt)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {formatNumber(novel.viewCount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Heart className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {formatNumber(novel.favoriteCount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="size-3.5 text-yellow-500" />
                        <span className="font-medium">
                          {formatRating(novel.ratingAverage)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({formatNumber(novel.ratingCount)})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {novel.totalChapters}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="space-y-3 md:hidden">
          {data.map((novel, index) => {
            const statusConfig = STATUS_LABELS[novel.status];
            const href = baseHref ? `${baseHref}/${novel.id}/volumes` : "#";

            return (
              <Link
                key={novel.id}
                href={href}
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-tight">{novel.title}</p>
                      <Badge variant={statusConfig.variant} className="text-xs">
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span>{formatNumber(novel.viewCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="size-3.5 text-muted-foreground" />
                        <span>{formatNumber(novel.favoriteCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="size-3.5 text-yellow-500" />
                        <span>{formatRating(novel.ratingAverage)}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {novel.totalChapters} chương
                      </div>
                    </div>

                    {novel.lastChapterAt && (
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(novel.lastChapterAt)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * TopNovelsTable Skeleton for loading states
 */
export function TopNovelsTableSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
