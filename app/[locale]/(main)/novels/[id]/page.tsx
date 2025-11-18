"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Eye,
  Heart,
  Star,
  Calendar,
  User,
  TrendingUp,
  ChevronRight,
  Lock,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    "Harry returns to Hogwarts School of Witchcraft and Wizardry for his second year. But this year, a mysterious presence is terrorizing the school. Students are being attacked and turned to stone, and a dark message appears on the wall: 'The Chamber of Secrets has been opened.' Harry must uncover the truth behind these attacks before Hogwarts is forced to close forever.",
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
      chapters: Array.from({ length: 18 }, (_, i) => ({
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
            "The Rogue Bludger",
            "Mudbloods and Murmurs",
            "The Death-Day Party",
            "Gilderoy Lockhart",
            "The Whomping Willow",
            "At Flourish and Blotts",
            "Dobby's Warning",
            "The Burrow",
            "Aragog",
            "The Very Secret Diary",
          ][i] || `Chapter ${18 - i}`
        }`,
        views: 95000 - i * 3000,
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
      rating: 5,
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
      rating: 5,
      time: "1 hour ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Chen",
        avatar: "/images/avatar-3.jpg",
      },
      comment: "The plot twist in this chapter was absolutely mind-blowing!",
      rating: 4,
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
    <div className="min-h-screen bg-background">
      {/* ================= HERO SECTION ================= */}
      <div className="border-b bg-gradient-to-b from-muted/30 to-background">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12">
            {/* Cover Image */}
            <div className="mx-auto md:mx-0">
              <div className="relative w-56 md:w-64 lg:w-72 aspect-[2/3] rounded-xl overflow-hidden border-2 bg-muted shadow-2xl">
                <Image
                  src={novelData.coverUrl}
                  alt={novelData.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{novelData.type}</Badge>
                <Badge
                  variant="outline"
                  className="border-green-600/30 text-green-600 bg-green-600/5"
                >
                  {novelData.status}
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                {novelData.genres.map((genre) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {novelData.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {novelData.originalTitle}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 text-base">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{novelData.author}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Star className="size-4" />
                    <span>Rating</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {novelData.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / 5.0
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatNumberAbbreviated(novelData.ratingCount)} reviews
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Eye className="size-4" />
                    <span>Views</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {formatNumberAbbreviated(novelData.views)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Heart className="size-4" />
                    <span>Favorites</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {formatNumberAbbreviated(novelData.favorites)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <TrendingUp className="size-4" />
                    <span>Rank</span>
                  </div>
                  <div className="text-3xl font-bold">#12</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" className="gap-2">
                  <BookOpen className="size-4" />
                  Start Reading
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
                  {isBookmarked ? "Bookmarked" : "Add to Library"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Synopsis */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Synopsis</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {novelData.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {novelData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Chapters */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Chapters</h2>
                <p className="text-sm text-muted-foreground">
                  {novelData.volumes[0].totalChapters} chapters
                </p>
              </div>

              <div className="grid gap-2">
                {novelData.volumes[0].chapters.map((chapter, index) => (
                  <Link
                    href={`/read/${novelData.slug}/${chapter.id}`}
                    key={chapter.id}
                    className="group"
                  >
                    <Card className="p-4 hover:shadow-md transition-all border-border/50 hover:border-border">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-muted-foreground shrink-0">
                              #{18 - index}
                            </span>
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                              {chapter.title}
                            </h3>
                            {!chapter.isFree && (
                              <Lock className="size-4 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {chapter.createdAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="size-3" />
                              {formatNumberAbbreviated(chapter.views)} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <Separator />

            {/* Reviews */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reader Reviews</h2>
                <Button variant="outline" size="sm">
                  Write Review
                </Button>
              </div>

              {/* Rating Summary */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold mb-2">
                      {novelData.rating}
                    </div>
                    <div className="flex items-center gap-1 justify-center sm:justify-start mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "size-5",
                            star <= Math.round(novelData.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatNumberAbbreviated(novelData.ratingCount)} ratings
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-12">
                          {stars} star
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{
                              width: `${
                                stars === 5
                                  ? 70
                                  : stars === 4
                                    ? 20
                                    : stars === 3
                                      ? 8
                                      : 2
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {stars === 5
                            ? "70%"
                            : stars === 4
                              ? "20%"
                              : stars === 3
                                ? "8%"
                                : "2%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Reviews */}
              <div className="space-y-4">
                {novelData.readerComments.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="size-12 shrink-0">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>
                          {review.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">
                              {review.user.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "size-4",
                                      star <= review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Book Details */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Book Details</h3>
              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium text-right">
                    {novelData.author}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Artist</span>
                  <span className="font-medium text-right">
                    {novelData.artist}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{novelData.releaseYear}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    {novelData.status}
                  </Badge>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Chapters</span>
                  <span className="font-medium">
                    {novelData.volumes[0].totalChapters}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="font-semibold">You May Also Like</h3>

              <div className="space-y-3">
                {novelData.recommendations.map((item) => (
                  <Link key={item.id} href="#" className="group block">
                    <Card className="p-3 hover:shadow-md transition-all">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1.5 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground italic">
                            {item.subtitle}
                          </p>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{item.rating}</span>
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
  );
}
