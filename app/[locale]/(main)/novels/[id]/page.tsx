"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Eye,
  Heart,
  Share2,
  Star,
  Calendar,
  User,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NovelTabs } from "./novel-tabs";

// --- MOCK DATA ---
const novelData = {
  id: "1",
  title: "Thợ Săn Cấp SSS Không Muốn Thăng Hạng",
  originalTitle: "The SSS-Class Hunter Doesn't Want to Rank Up",
  slug: "tho-san-cap-sss",
  coverUrl: "/images/image-4.jpg",
  author: "Dungeon Master",
  artist: "Studio Red",
  rating: 4.8,
  ratingCount: 1240,
  views: 850000,
  favorites: 45000,
  status: "Đang tiến hành",
  type: "Novel",
  releaseYear: 2024,
  description: `
    <p class="mb-4">Thế giới thay đổi khi các Cổng (Gates) xuất hiện. Quái vật tràn vào nhân gian, và những người thức tỉnh năng lực đặc biệt được gọi là Thợ Săn (Hunters).</p>
    <p class="mb-4">Tôi, <strong>Kang Jin-woo</strong>, thức tỉnh với tư cách là một Thợ Săn cấp F yếu ớt. Nhưng một ngày nọ, tôi tình cờ tìm thấy một hệ thống kỳ lạ cho phép tôi "Sao chép" kỹ năng của người khác...</p>
    <p>Vấn đề là? Tôi chỉ muốn sống một cuộc đời bình yên làm nông dân trong hầm ngục thôi! Tại sao các người cứ bắt tôi đi cứu thế giới vậy?</p>
  `,
  genres: [
    { id: "1", name: "Action" },
    { id: "2", name: "Fantasy" },
    { id: "3", name: "System" },
    { id: "4", name: "Comedy" },
  ],
  tags: ["Main Bá", "Giấu Nghề", "Hài Hước", "Harem", "Reincarnation"],
  volumes: [
    {
      id: "vol-3",
      title: "Tập 3: Chiến tranh bang hội",
      totalChapters: 12,
      chapters: Array.from({ length: 12 }, (_, i) => ({
        id: `3-${12 - i}`,
        title: `Chương ${138 + (12 - i)}: Cuộc chiến cuối cùng phần ${12 - i}`,
        views: 12500,
        createdAt: `${i + 1} giờ trước`,
        isFree: false,
      })),
    },
    {
      id: "vol-2",
      title: "Tập 2: Học viện Thợ Săn",
      totalChapters: 50,
      chapters: Array.from({ length: 6 }, (_, i) => ({
        id: `2-${50 - i}`,
        title: `Chương ${138 - i}: Bài kiểm tra đầu vào`,
        views: 45000,
        createdAt: "1 tháng trước",
        isFree: true,
      })),
    },
    {
      id: "vol-1",
      title: "Tập 1: Sự thức tỉnh",
      totalChapters: 88,
      chapters: Array.from({ length: 5 }, (_, i) => ({
        id: `1-${88 - i}`,
        title: `Chương ${88 - i}: Bắt đầu hành trình`,
        views: 90000,
        createdAt: "1 năm trước",
        isFree: true,
      })),
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "Ta Là Tà Đế",
      rating: 4.5,
      image: "/images/image-1.jpg",
    },
    {
      id: 2,
      title: "Toàn Trí Độc Giả",
      rating: 4.9,
      image: "/images/image-2.jpg",
    },
    {
      id: 3,
      title: "Thăng Cấp Một Mình",
      rating: 4.7,
      image: "/images/image-5.jpg",
    },
    {
      id: 4,
      title: "Đỉnh Cấp Khí Vận",
      rating: 4.2,
      image: "/images/image-4.jpg",
    },
  ],
};

export default function NovelDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* ================= CLEAN HERO SECTION ================= */}
      <Container className="py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12">
          {/* Cover Image - Clean, No Effects */}
          <div className="mx-auto md:mx-0">
            <div className="relative w-48 md:w-56 lg:w-64 aspect-[2/3] rounded-lg overflow-hidden border bg-muted">
              <Image
                src={novelData.coverUrl}
                alt={novelData.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {novelData.type}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-normal border-green-600/30 text-green-600 bg-green-600/5"
              >
                {novelData.status}
              </Badge>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {novelData.title}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {novelData.originalTitle}
              </p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {novelData.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="size-4" />
                  <span className="text-xs font-medium">Rating</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{novelData.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatNumberAbbreviated(novelData.ratingCount)})
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="size-4" />
                  <span className="text-xs font-medium">Views</span>
                </div>
                <span className="text-2xl font-bold">
                  {formatNumberAbbreviated(novelData.views)}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Heart className="size-4" />
                  <span className="text-xs font-medium">Favorites</span>
                </div>
                <span className="text-2xl font-bold">
                  {formatNumberAbbreviated(novelData.favorites)}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="size-4" />
                  <span className="text-xs font-medium">Rank</span>
                </div>
                <span className="text-2xl font-bold">#12</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <BookOpen className="size-4" />
                Đọc Từ Đầu
              </Button>
              <Button
                size="lg"
                variant={isBookmarked ? "secondary" : "outline"}
                className="gap-2"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart
                  className={cn("size-4", isBookmarked && "fill-current")}
                />
                {isBookmarked ? "Đã Lưu" : "Yêu Thích"}
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Share2 className="size-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Separator />

      {/* ================= CONTENT SECTION ================= */}
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            <NovelTabs novel={novelData} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Info Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-sm">Thông Tin</h3>
              <Separator />

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs text-muted-foreground">Tác giả</span>
                    <span className="font-medium truncate">{novelData.author}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs text-muted-foreground">Họa sĩ</span>
                    <span className="font-medium truncate">{novelData.artist}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Năm phát hành</span>
                    <span className="font-medium">{novelData.releaseYear}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Có thể bạn thích</h3>
                <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Xem thêm
                </Link>
              </div>

              <div className="space-y-3">
                {novelData.recommendations.map((item) => (
                  <Link key={item.id} href="#" className="group block">
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="relative w-12 h-16 rounded overflow-hidden shrink-0 bg-muted border">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="size-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
