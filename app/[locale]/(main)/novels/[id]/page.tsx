"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Eye,
  Heart,
  Star,
  User,
  TrendingUp,
  ChevronRight,
  Lock,
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StaticEditorView } from "@/components/editor/static-editor-view";
import type { TNode } from "platejs";

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
  description: [
    {
      type: "p",
      children: [
        {
          text: "Harry returns to Hogwarts School of Witchcraft and Wizardry for his second year. But this year, a mysterious presence is terrorizing the school. Students are being attacked and turned to stone, and a dark message appears on the wall: ",
        },
        { text: "'The Chamber of Secrets has been opened.'", bold: true },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "Harry must uncover the truth behind these attacks before Hogwarts is forced to close forever. With the help of his friends Ron and Hermione, he delves into the school's dark history and discovers secrets that have been hidden for fifty years.",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "As the mystery deepens, Harry finds himself hearing strange voices in the walls and discovers he can speak Parseltongue, the language of serpents. Is Harry the heir of Slytherin? Can he save the school before it's too late?",
        },
      ],
    },
  ] as const,
  genres: [
    { id: "1", name: "Fantasy" },
    { id: "2", name: "Adventure" },
    { id: "3", name: "Mystery" },
  ],
  tags: ["Magic", "Wizards", "School Life", "Adventure", "Young Adult"],
  volumes: [
    {
      id: "vol-1",
      title: "Volume 1: The Mystery Begins",
      description: "Harry's second year starts with strange warnings and mysterious attacks.",
      coverUrl: "/images/image-1.jpg",
      totalChapters: 6,
      chapters: [
        {
          id: "ch-1",
          title: "Chapter 1: The Worst Birthday",
          views: 95000,
          createdAt: "1 year ago",
          isFree: true,
        },
        {
          id: "ch-2",
          title: "Chapter 2: Dobby's Warning",
          views: 92000,
          createdAt: "1 year ago",
          isFree: true,
        },
        {
          id: "ch-3",
          title: "Chapter 3: The Burrow",
          views: 89000,
          createdAt: "1 year ago",
          isFree: true,
        },
        {
          id: "ch-4",
          title: "Chapter 4: At Flourish and Blotts",
          views: 86000,
          createdAt: "1 year ago",
          isFree: true,
        },
        {
          id: "ch-5",
          title: "Chapter 5: The Whomping Willow",
          views: 83000,
          createdAt: "1 year ago",
          isFree: true,
        },
        {
          id: "ch-6",
          title: "Chapter 6: Gilderoy Lockhart",
          views: 80000,
          createdAt: "11 months ago",
          isFree: true,
        },
      ],
    },
    {
      id: "vol-2",
      title: "Volume 2: Dark Secrets",
      description: "The Chamber of Secrets is opened and terror spreads through Hogwarts.",
      coverUrl: "/images/image-2.jpg",
      totalChapters: 6,
      chapters: [
        {
          id: "ch-7",
          title: "Chapter 7: Mudbloods and Murmurs",
          views: 77000,
          createdAt: "10 months ago",
          isFree: true,
        },
        {
          id: "ch-8",
          title: "Chapter 8: The Deathday Party",
          views: 74000,
          createdAt: "9 months ago",
          isFree: true,
        },
        {
          id: "ch-9",
          title: "Chapter 9: The Writing on the Wall",
          views: 71000,
          createdAt: "8 months ago",
          isFree: false,
        },
        {
          id: "ch-10",
          title: "Chapter 10: The Rogue Bludger",
          views: 68000,
          createdAt: "7 months ago",
          isFree: false,
        },
        {
          id: "ch-11",
          title: "Chapter 11: The Dueling Club",
          views: 65000,
          createdAt: "6 months ago",
          isFree: false,
        },
        {
          id: "ch-12",
          title: "Chapter 12: The Polyjuice Potion",
          views: 62000,
          createdAt: "5 months ago",
          isFree: false,
        },
      ],
    },
    {
      id: "vol-3",
      title: "Volume 3: The Truth Revealed",
      description: "Harry discovers the shocking truth behind the Chamber of Secrets.",
      coverUrl: "/images/image-5.jpg",
      totalChapters: 6,
      chapters: [
        {
          id: "ch-13",
          title: "Chapter 13: The Very Secret Diary",
          views: 59000,
          createdAt: "4 months ago",
          isFree: false,
        },
        {
          id: "ch-14",
          title: "Chapter 14: Cornelius Fudge",
          views: 56000,
          createdAt: "3 months ago",
          isFree: false,
        },
        {
          id: "ch-15",
          title: "Chapter 15: Aragog",
          views: 53000,
          createdAt: "2 months ago",
          isFree: false,
        },
        {
          id: "ch-16",
          title: "Chapter 16: The Chamber of Secrets",
          views: 50000,
          createdAt: "1 month ago",
          isFree: false,
        },
        {
          id: "ch-17",
          title: "Chapter 17: The Heir of Slytherin",
          views: 47000,
          createdAt: "2 weeks ago",
          isFree: false,
        },
        {
          id: "ch-18",
          title: "Chapter 18: Dobby's Reward",
          views: 44000,
          createdAt: "1 week ago",
          isFree: false,
        },
      ],
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
  const t = useTranslations("novel.detail");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const totalChapters = novelData.volumes.reduce(
    (sum, vol) => sum + vol.totalChapters,
    0
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
                    <span>{t("rating")}</span>
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
                    {formatNumberAbbreviated(novelData.ratingCount)} {t("ratings")}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Eye className="size-4" />
                    <span>{t("views")}</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {formatNumberAbbreviated(novelData.views)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Heart className="size-4" />
                    <span>{t("favorites")}</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {formatNumberAbbreviated(novelData.favorites)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <TrendingUp className="size-4" />
                    <span>{t("rank")}</span>
                  </div>
                  <div className="text-3xl font-bold">#12</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" className="gap-2">
                  <BookOpen className="size-4" />
                  {t("startReading")}
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
                  {isBookmarked ? t("bookmarked") : t("addToLibrary")}
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
              <h2 className="text-2xl font-bold">{t("synopsis")}</h2>
              <StaticEditorView
                content={novelData.description as TNode[]}
                variant="compact"
                className="text-base text-muted-foreground leading-relaxed"
              />

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

            {/* Volumes & Chapters (3-Level Hierarchy) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("volumesAndChapters")}</h2>
                <p className="text-sm text-muted-foreground">
                  {novelData.volumes.length} {t("volumes")} • {totalChapters} {t("chapters")}
                </p>
              </div>

              {/* Volumes Accordion */}
              <Accordion
                type="multiple"
                defaultValue={[novelData.volumes[0].id]}
                className="space-y-4"
              >
                {novelData.volumes.map((volume, volumeIndex) => (
                  <AccordionItem
                    key={volume.id}
                    value={volume.id}
                    className="border rounded-xl overflow-hidden bg-card"
                  >
                    {/* Volume Header */}
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                      <div className="flex items-center gap-4 w-full text-left pr-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted border shadow-sm">
                          <Image
                            src={volume.coverUrl}
                            alt={volume.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base mb-1">
                            {volume.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {volume.description}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <Badge variant="secondary" className="font-normal">
                            {volume.totalChapters} chapters
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>

                    {/* Volume Chapters */}
                    <AccordionContent className="px-6 pb-4">
                      <div className="border-t pt-4 space-y-2">
                        {volume.chapters.map((chapter, chapterIndex) => (
                          <Link
                            href={`/read/${novelData.slug}/${chapter.id}`}
                            key={chapter.id}
                            className="group block"
                          >
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-sm font-medium text-muted-foreground shrink-0 w-8">
                                  {volumeIndex * 6 + chapterIndex + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                                      {chapter.title}
                                    </h4>
                                    {!chapter.isFree && (
                                      <Lock className="size-4 text-amber-500 shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {chapter.createdAt}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Eye className="size-3" />
                                      {formatNumberAbbreviated(chapter.views)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <Separator />

            {/* Reviews */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("readerReviews")}</h2>
                <Button variant="outline" size="sm">
                  {t("writeReview")}
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
                      {formatNumberAbbreviated(novelData.ratingCount)} {t("ratings")}
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
              <h3 className="font-semibold">{t("bookDetails")}</h3>
              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("author")}</span>
                  <span className="font-medium text-right">
                    {novelData.author}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("artist")}</span>
                  <span className="font-medium text-right">
                    {novelData.artist}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("published")}</span>
                  <span className="font-medium">{novelData.releaseYear}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("status")}</span>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    {novelData.status}
                  </Badge>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("volumes")}</span>
                  <span className="font-medium">
                    {novelData.volumes.length}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t("chapters")}</span>
                  <span className="font-medium">{totalChapters}</span>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="font-semibold">{t("youMayAlsoLike")}</h3>

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
