import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { BookOpen, Eye, Heart, Star, TrendingUp, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AddToLibraryButton } from "./add-to-library-button";

interface Genre {
  id: string;
  name: string;
}

interface NovelHeroSectionProps {
  id: string;
  title: string;
  originalTitle: string;
  coverUrl: string;
  author: string;
  type: string;
  status: string;
  genres: Genre[];
  rating: number;
  ratingCount: number;
  views: number;
  favorites: number;
  isBookmarked?: boolean;
}

export async function NovelHeroSection({
  id,
  title,
  originalTitle,
  coverUrl,
  author,
  type,
  status,
  genres,
  rating,
  ratingCount,
  views,
  favorites,
  isBookmarked = false,
}: NovelHeroSectionProps) {
  const t = await useTranslations("novel.detail");

  return (
    <div className="border-b bg-gradient-to-b from-muted/30 to-background">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12">
          {/* Cover Image */}
          <div className="mx-auto md:mx-0">
            <div className="relative w-56 md:w-64 lg:w-72 aspect-[2/3] rounded-xl overflow-hidden border-2 bg-muted shadow-2xl">
              <Image
                src={coverUrl}
                alt={title}
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
              <Badge variant="secondary">{type}</Badge>
              <Badge
                variant="outline"
                className="border-green-600/30 text-green-600 bg-green-600/5"
              >
                {status}
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              {genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">{originalTitle}</p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-base">
              <User className="size-4 text-muted-foreground" />
              <span className="font-medium">{author}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Star className="size-4" />
                  <span>{t("rating")}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{rating}</span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumberAbbreviated(ratingCount)} {t("ratings")}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Eye className="size-4" />
                  <span>{t("views")}</span>
                </div>
                <div className="text-3xl font-bold">
                  {formatNumberAbbreviated(views)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Heart className="size-4" />
                  <span>{t("favorites")}</span>
                </div>
                <div className="text-3xl font-bold">
                  {formatNumberAbbreviated(favorites)}
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
              <Button size="lg" className="gap-2" asChild>
                <Link href={`/read/${id}/ch-1`}>
                  <BookOpen className="size-4" />
                  {t("startReading")}
                </Link>
              </Button>
              <AddToLibraryButton
                novelId={id}
                initialBookmarked={isBookmarked}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
