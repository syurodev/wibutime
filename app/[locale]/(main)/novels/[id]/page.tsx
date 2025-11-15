"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { BookOpen, Eye, Flag, Heart, Share2, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NovelTabs } from "./novel-tabs";

// --- 1. MOCK DATA ---
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
    <div className="min-h-screen bg-background pb-20">
      {/* ================= HEADER SECTION (IMMERSIVE) ================= */}
      <div className="relative w-full h-auto md:h-[550px] bg-background overflow-hidden group">
        {/* LAYER 1: BACKGROUND BLUR (Với hiệu ứng tan biến chân trang) */}
        <div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{
            // Kỹ thuật Mask Image để làm ảnh "tan chảy" vào nền web
            maskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        >
          <Image
            src={novelData.coverUrl}
            alt={novelData.title}
            fill
            className="object-cover opacity-40 blur-3xl scale-110 saturate-150 transform-gpu"
            priority
          />
          {/* Gradient overlay nhẹ để bảo vệ text trắng */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* LAYER 2: HERO CONTENT */}
        <Container className="relative z-10 pt-24 pb-8 md:pt-32 md:pb-12 h-full flex flex-col justify-end">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-end text-center md:text-left">
            {/* POSTER (Floating 3D Effect) */}
            <div className="relative shrink-0 group w-[160px] md:w-[240px]">
              <div className="absolute -inset-4 bg-primary/20 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 rotate-0 md:rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-zinc-900">
                <Image
                  src={novelData.coverUrl}
                  alt={novelData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 240px"
                />
              </div>
            </div>

            {/* INFO AREA */}
            <div className="flex-1 space-y-4 w-full">
              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md hover:bg-primary/30">
                  {novelData.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500/30 text-green-500 bg-green-500/10"
                >
                  {novelData.status}
                </Badge>
                {novelData.genres.map((g) => (
                  <Badge
                    key={g.id}
                    variant="secondary"
                    className="bg-background/50 backdrop-blur-md"
                  >
                    {g.name}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground drop-shadow-sm">
                  {novelData.title}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base font-medium">
                  {novelData.originalTitle}
                </p>
              </div>

              {/* Author & Stats */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="font-medium text-foreground">
                    {novelData.author}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star className="size-4 fill-current" />
                  <span className="font-bold">{novelData.rating}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({formatNumberAbbreviated(novelData.ratingCount)})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="size-4" />
                  <span>{formatNumberAbbreviated(novelData.views)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="size-4" />
                  <span>{formatNumberAbbreviated(novelData.favorites)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-bold shadow-lg shadow-primary/20 rounded-full gap-2"
                >
                  <BookOpen className="size-5" />
                  Đọc Từ Đầu
                </Button>
                <Button
                  size="lg"
                  variant={isBookmarked ? "secondary" : "outline"}
                  className={cn(
                    "h-12 px-6 text-base font-semibold rounded-full gap-2 transition-all",
                    isBookmarked &&
                      "bg-pink-500/10 text-pink-500 border-pink-500/50 hover:bg-pink-500/20"
                  )}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Heart
                    className={cn("size-5", isBookmarked && "fill-current")}
                  />
                  {isBookmarked ? "Đã Lưu" : "Yêu Thích"}
                </Button>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-12 rounded-full hover:bg-muted/50"
                  >
                    <Share2 className="size-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-12 rounded-full hover:bg-muted/50"
                  >
                    <Flag className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ================= BODY SECTION ================= */}
      <Container className="mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: MAIN CONTENT (TABS) --- */}
          {/* Chiếm 8/12 không gian */}
          <div className="lg:col-span-8 space-y-8">
            {/* === SỬ DỤNG TAB COMPONENT ĐÃ TÁCH === */}
            <NovelTabs novel={novelData} />
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR --- */}
          {/* Chiếm 4/12 không gian */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* 1. Info Box */}
            <Card className="overflow-hidden shadow-sm border-border/50">
              <div className="px-5 py-3 border-b bg-muted/30">
                <h3 className="font-bold text-sm">Thông Tin Chi Tiết</h3>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground shrink-0">
                    Tên khác
                  </span>
                  <span className="font-medium text-right pl-4 line-clamp-2">
                    {novelData.originalTitle}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tác giả</span>
                  <span className="font-medium text-primary">
                    {novelData.author}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hoạ sĩ</span>
                  <span className="font-medium">{novelData.artist}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Năm phát hành</span>
                  <span className="font-medium">{novelData.releaseYear}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quốc gia</span>
                  <span className="font-medium">Hàn Quốc</span>
                </div>
              </div>
            </Card>

            {/* 2. Recommendations List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-lg">Có thể bạn thích</h3>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Xem thêm
                </Link>
              </div>
              <ScrollArea className="h-[400px] pr-4 -mr-4">
                <div className="flex flex-col gap-3">
                  {novelData.recommendations.map((item) => (
                    <Link key={item.id} href="#" className="group">
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border/50">
                        <div className="relative w-14 h-20 rounded-md overflow-hidden shrink-0 border shadow-sm bg-muted">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center text-yellow-500 font-medium">
                              <Star className="size-3 mr-1 fill-current" />{" "}
                              {item.rating}
                            </span>
                            <span>•</span>
                            <span>Manhwa</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
