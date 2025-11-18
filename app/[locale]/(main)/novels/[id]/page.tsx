"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Clock,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NovelTabs } from "./novel-tabs";

// --- MOCK DATA ---
const novelData = {
  id: "1",
  title: "The Chambers of Secrets",
  originalTitle: "Harry Potter and the Chamber of Secrets",
  slug: "chambers-of-secrets",
  coverUrl: "/images/image-4.jpg",
  author: "J.K. Rowlings",
  artist: "Mary GrandPré",
  rating: 4.8,
  ratingCount: 1240,
  views: 850000,
  favorites: 45000,
  status: "Completed",
  type: "Novel",
  releaseYear: 1998,
  currentPage: 154,
  totalPages: 300,
  description:
    "Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that a mysterious presence is terrorizing the school...",
  genres: [
    { id: "1", name: "Fantasy" },
    { id: "2", name: "Adventure" },
    { id: "3", name: "Mystery" },
  ],
  tags: ["Magic", "Wizards", "School Life", "Adventure", "Young Adult"],
  volumes: [
    {
      id: "vol-1",
      title: "Complete Edition",
      totalChapters: 18,
      chapters: Array.from({ length: 8 }, (_, i) => ({
        id: `ch-${18 - i}`,
        title: `Chapter ${18 - i}: ${
          [
            "The Epilogue",
            "Dobby's Reward",
            "The Heir of Slytherin",
            "Cornelius Fudge",
            "The Diary",
            "The Writing on the Wall",
            "The Dueling Club",
            "The Polyjuice Potion",
          ][i]
        }`,
        views: 95000 - i * 5000,
        createdAt: `${i + 1} months ago`,
        isFree: true,
      })),
    },
  ],
  readerComments: [
    {
      id: 1,
      user: {
        name: "Roberto Jordan",
        avatar: "/images/avatar-1.jpg",
      },
      comment:
        "What a delightful and magical chapter it is! It indeed transports readers to the wizarding world.",
      chapter: "Chapter Five: Diagon Alley",
      time: "2 min ago",
    },
    {
      id: 2,
      user: {
        name: "Anna Henry",
        avatar: "/images/avatar-2.jpg",
      },
      comment:
        "I finished reading the chapter last night and I'm completely hooked! The mystery is getting deeper.",
      chapter: "Chapter Seven: The Dueling Club",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Chen",
        avatar: "/images/avatar-3.jpg",
      },
      comment: "The plot twist in this chapter was absolutely mind-blowing!",
      chapter: "Chapter Ten: The Rogue Bludger",
      time: "3 hours ago",
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "The Philosopher's Stone",
      subtitle: "Harry Potter Vol I",
      rating: 4.9,
      image: "/images/image-1.jpg",
    },
    {
      id: 2,
      title: "The Prisoner of Azkaban",
      subtitle: "Harry Potter Vol III",
      rating: 4.7,
      image: "/images/image-2.jpg",
    },
    {
      id: 3,
      title: "The Goblet of Fire",
      subtitle: "Harry Potter Vol IV",
      rating: 4.8,
      image: "/images/image-5.jpg",
    },
  ],
};

export default function NovelDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const progressPercent = Math.round(
    (novelData.currentPage / novelData.totalPages) * 100
  );

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* ================= HERO SECTION (Book-Opened Style) ================= */}
      <Container className="py-12 md:py-16">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2d2d2d] mb-3">
            Continue reading,
          </h1>
          <p className="text-lg text-[#666] max-w-2xl leading-relaxed">
            You've made great progress! Only{" "}
            <span className="font-semibold text-[#2d2d2d]">
              {novelData.totalPages - novelData.currentPage} pages
            </span>{" "}
            left to finish this amazing story.
          </p>
        </div>

        {/* Book Display with Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Book Opened Visual */}
          <div className="relative">
            {/* Shadow underneath */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-black/5 blur-2xl" />

            {/* Book Pages */}
            <div className="relative bg-white rounded-lg shadow-2xl p-8 md:p-12">
              {/* Simulated book binding in the middle */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -translate-x-1/2" />

              <div className="grid grid-cols-2 gap-8">
                {/* Left Page - Text Content */}
                <div className="space-y-4 text-sm leading-relaxed text-gray-700 font-serif pr-4">
                  <p className="text-xs text-gray-400 mb-4">CHAPTER SIX</p>
                  <p>
                    Harry had been to several Hogwarts feasts, but never one
                    quite like this. Everybody was in their pajamas, and the
                    celebration had been going on all night...
                  </p>
                  <p className="text-xs text-gray-400 text-right mt-8">154</p>
                </div>

                {/* Right Page - Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm pl-4">
                  <Image
                    src={novelData.coverUrl}
                    alt={novelData.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2d2d] mb-2">
                {novelData.title}
              </h2>
              <div className="flex items-center gap-2 text-[#e85d4d] font-medium">
                <span className="text-xl">
                  {novelData.currentPage} / {novelData.totalPages} pages
                </span>
              </div>
            </div>

            <p className="text-base text-[#666] leading-relaxed">
              {novelData.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-[#666]">
              <span>–</span>
              <span className="font-medium text-[#2d2d2d]">
                {novelData.author}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">Reading progress</span>
                <span className="font-semibold text-[#2d2d2d]">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2d2d2d] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white rounded-full px-8 gap-2"
              >
                <BookOpen className="size-4" />
                Continue Reading
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "rounded-full px-6 gap-2 border-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-white",
                  isBookmarked && "bg-[#2d2d2d] text-white"
                )}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart
                  className={cn("size-4", isBookmarked && "fill-current")}
                />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-4 text-sm text-[#666]">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-[#2d2d2d]">
                  {novelData.rating}
                </span>
                <span>({formatNumberAbbreviated(novelData.ratingCount)})</span>
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
          </div>
        </div>
      </Container>

      {/* ================= CONTENT SECTION ================= */}
      <div className="bg-white/50 py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            {/* Main Content */}
            <div className="min-w-0">
              <NovelTabs novel={novelData} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Reader Comments/Friends Activity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-[#2d2d2d]">
                    Reader Friends
                  </h3>
                  <button className="text-xs text-[#666] hover:text-[#2d2d2d]">
                    See all
                  </button>
                </div>

                <div className="space-y-4">
                  {novelData.readerComments.map((comment) => (
                    <Card
                      key={comment.id}
                      className="p-4 bg-white border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-3">
                        <Avatar className="size-10 shrink-0">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>
                            {comment.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-sm text-[#2d2d2d]">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-[#999] shrink-0">
                              {comment.time}
                            </span>
                          </div>
                          <p className="text-sm text-[#666] leading-relaxed italic">
                            "{comment.comment}"
                          </p>
                          <div className="flex items-center gap-1 text-xs text-[#e85d4d]">
                            <span className="line-clamp-1">
                              ✓ {comment.chapter}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Book Info Card */}
              <Card className="p-6 bg-white border-gray-200">
                <h3 className="text-sm font-semibold text-[#2d2d2d] mb-4">
                  Book Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#999]">Author</span>
                    <span className="font-medium text-[#2d2d2d]">
                      {novelData.author}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#999]">Artist</span>
                    <span className="font-medium text-[#2d2d2d]">
                      {novelData.artist}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#999]">Published</span>
                    <span className="font-medium text-[#2d2d2d]">
                      {novelData.releaseYear}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#999]">Status</span>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                      {novelData.status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-[#2d2d2d]">
                  You May Also Like
                </h3>

                <div className="space-y-3">
                  {novelData.recommendations.map((item) => (
                    <Link key={item.id} href="#" className="group block">
                      <Card className="p-3 bg-white border-gray-200 hover:shadow-md transition-all">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center gap-1.5 min-w-0">
                            <h4 className="font-semibold text-sm text-[#2d2d2d] line-clamp-1 group-hover:text-[#e85d4d] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#999] italic">
                              {item.subtitle}
                            </p>
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-[#2d2d2d]">
                                {item.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </div>
  );
}
