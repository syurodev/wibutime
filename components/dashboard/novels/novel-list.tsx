"use client";

import { Link } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils/get-image-url";
import {
  BookOpen,
  FileEdit,
  LayoutGrid,
  LayoutList,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaSeries } from "@/features/content";
import { MEDIA_STATUS } from "@/lib/constants/default";
import { getInitials } from "@/lib/utils/get-initials";

interface NovelListProps {
  readonly novels: MediaSeries[];
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case MEDIA_STATUS.ONGOING:
    case MEDIA_STATUS.COMPLETED:
      return "default";
    case "draft":
      return "outline";
    case "hiatus":
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

// Action handlers (placeholder - can be connected to actual APIs)
function handleDelete(novelId: string) {
  console.log("Delete novel:", novelId);
  // FIXME: Implement delete API call
}

// Direct Action Buttons Component
function NovelActionButtons({ novel }: { readonly novel: MediaSeries }) {
  const t = useTranslations("dashboard.novels.actionMenu");

  return (
    <div className="flex items-center gap-1">
      {/* View Volumes */}
      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
        <Link
          href={`/dashboard/novels/${novel.id}/volumes`}
          title={t("viewVolumes")}
        >
          <BookOpen className="h-4 w-4" />
        </Link>
      </Button>

      {/* Edit */}
      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
        <Link href={`/dashboard/novels/${novel.id}/edit`} title={t("edit")}>
          <FileEdit className="h-4 w-4" />
        </Link>
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        title={t("delete")}
        onClick={() => handleDelete(novel.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Novel Cover Component with ImageWithFallback
function NovelCover({
  novel,
  size = "sm",
}: {
  readonly novel: MediaSeries;
  readonly size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? { w: 66, h: 100 } : { w: 80, h: 120 };

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-muted"
      style={{ width: dimensions.w, height: dimensions.h }}
    >
      <ImageWithFallback
        src={getImageUrl(novel.cover_url)}
        alt={novel.title}
        fill
        className="object-cover"
        fallback={getInitials(novel.title)}
      />
    </div>
  );
}

// Language display component
function LanguageBadge({ lang }: { readonly lang: string }) {
  const t = useTranslations("dashboard.novels.languages");
  const langKey = lang.toLowerCase();

  // Check if language key exists
  const knownLanguages = ["ja", "en", "ko", "zh", "vi"];
  const displayText = knownLanguages.includes(langKey)
    ? t(langKey as "ja" | "en" | "ko" | "zh" | "vi")
    : t("unknown", { code: lang.toUpperCase() });

  return (
    <Badge variant="outline" className="text-xs uppercase">
      {displayText}
    </Badge>
  );
}

export function NovelList({ novels }: NovelListProps) {
  const [view, setView] = useState<"grid" | "table">("table");
  const t = useTranslations("dashboard.novels");
  const tStatus = useTranslations("dashboard.status");
  const tStats = useTranslations("dashboard.novels.stats");
  const tTable = useTranslations("dashboard.novels.table");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("countSubtitle", { count: novels.length })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("table")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          <Button asChild>
            <Link href="/dashboard/novels/create">
              <Plus className="h-4 w-4 mr-2" />
              {t("createNew")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {novels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("empty.title")}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {t("empty.description")}
            </p>
            <Button asChild>
              <Link href="/dashboard/novels/create">
                <Plus className="h-4 w-4 mr-2" />
                {t("createFirst")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid View */}
          {view === "grid" && (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {novels.map((novel) => (
                <Card key={novel.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Cover */}
                      <NovelCover novel={novel} size="md" />

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title row with action buttons */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold line-clamp-2 leading-tight">
                              {novel.title}
                            </h3>
                            {novel.original_title && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {novel.original_title}
                              </p>
                            )}
                          </div>
                          <NovelActionButtons novel={novel} />
                        </div>

                        {/* Language & Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <LanguageBadge lang={novel.original_language} />
                          <Badge
                            variant={getStatusVariant(novel.status)}
                            className="text-xs capitalize"
                          >
                            {tStatus(novel.status as keyof typeof tStatus)}
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {tStats("views", {
                              count: novel.views.toLocaleString(),
                            })}
                          </span>
                          <span>•</span>
                          <span>
                            {tStats("favorites", { count: novel.favorites })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Table View */}
          {view === "table" && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">
                      {tTable("cover")}
                    </TableHead>
                    <TableHead>{tTable("info")}</TableHead>
                    <TableHead className="w-[100px]">
                      {tTable("language")}
                    </TableHead>
                    <TableHead className="w-[120px]">
                      {tTable("status")}
                    </TableHead>
                    <TableHead className="w-[120px]">
                      {tTable("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {novels.map((novel) => (
                    <TableRow key={novel.id}>
                      {/* Cover */}
                      <TableCell>
                        <NovelCover novel={novel} size="sm" />
                      </TableCell>

                      {/* Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-1">
                            {novel.title}
                          </div>
                          {novel.original_title && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {novel.original_title}
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              {tStats("views", {
                                count: novel.views.toLocaleString(),
                              })}
                            </span>
                            <span>
                              {tStats("favorites", { count: novel.favorites })}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Language */}
                      <TableCell>
                        <LanguageBadge lang={novel.original_language} />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(novel.status)}
                          className="capitalize"
                        >
                          {tStatus(novel.status as keyof typeof tStatus)}
                        </Badge>
                      </TableCell>

                      {/* Actions - Direct buttons */}
                      <TableCell>
                        <NovelActionButtons novel={novel} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
