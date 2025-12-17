/**
 * Novel Hero Section - Server Component
 * Displays novel cover, title, status badge, and action buttons
 */

import { Container } from "@/components/layout/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { BasicStaticEditorView } from "@/features/editor/components/basic-static-editor-view";
import type { NovelFullResponse } from "@/features/novel/types";
import { Link } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { BookOpen, Bookmark, Eye, Heart, Star, User } from "lucide-react";

interface NovelHeroProps {
  readonly novel: NovelFullResponse;
}

const statusMap: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  ongoing: { label: "Đang tiến hành", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  hiatus: { label: "Tạm ngưng", variant: "outline" },
  dropped: { label: "Ngưng cập nhật", variant: "destructive" },
  draft: { label: "Nháp", variant: "outline" },
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function NovelHero({ novel }: NovelHeroProps) {
  const status = statusMap[novel.status] || {
    label: novel.status,
    variant: "outline" as const,
  };

  return (
    <div className="relative">
      {/* Background blur */}
      {novel.cover_image_url && (
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src={getImageUrl(novel.cover_image_url)}
            alt={novel.title}
            fill
            className="object-cover blur-3xl opacity-20 scale-110"
            fallback={getInitials(novel.title)}
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/80 to-background" />
        </div>
      )}

      <Container className="relative py-8 lg:py-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Cover Image */}
          <div className="shrink-0">
            <div className="relative w-48 h-72 md:w-56 md:h-80 rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
              <ImageWithFallback
                src={getImageUrl(novel.cover_image_url)}
                alt={novel.title}
                fill
                className="object-cover"
                fallback={getInitials(novel.title)}
              />
            </div>
          </div>

          {/* Novel Info */}
          <div className="flex-1 space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={status.variant}>{status.label}</Badge>
              {novel.is_oneshot && <Badge variant="outline">Oneshot</Badge>}
              {novel.original_language && (
                <Badge variant="outline">
                  {novel.original_language.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                {novel.title}
              </h1>
              {novel.original_title && (
                <p className="text-muted-foreground mt-1">
                  {novel.original_title}
                </p>
              )}
            </div>

            {/* Author & Owner */}
            <div className="flex items-center gap-4 flex-wrap">
              {novel.authors.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-muted-foreground">Tác giả:</span>
                  <span className="font-medium">
                    {novel.authors.map((a, index) => (
                      <span key={a.id}>
                        {a.slug ? (
                          <Link
                            href={`/authors/${a.slug}`}
                            className="hover:underline hover:text-primary"
                          >
                            {a.name}
                          </Link>
                        ) : (
                          a.name
                        )}
                        {index < novel.authors.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </div>
              )}
              <Link
                href={`/users/${
                  novel.owner.slug || novel.owner.username || novel.owner.id
                }`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={getImageUrl(novel.owner.avatar_url)} />
                  <AvatarFallback>
                    {getInitials(
                      novel.owner.display_name || novel.owner.name || ""
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hover:underline">
                  {novel.owner.display_name || novel.owner.name}
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">
                  {novel.rating_average.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({novel.rating_count})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(novel.view_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(novel.favorite_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{novel.total_chapters} chương</span>
              </div>
            </div>

            {/* Genres */}
            {novel.genres.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {novel.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Đọc ngay
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Theo dõi
              </Button>
            </div>
          </div>
        </div>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="text-lg">Giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <BasicStaticEditorView content={novel.synopsis} maxLines={99} />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
