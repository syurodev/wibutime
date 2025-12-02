"use client";

import { Container } from "@/components/layout/Container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { BasicStaticEditorView } from "@/features/editor/components/basic-static-editor-view";
import { Link } from "@/i18n/routing";
import { MediaSeries } from "@/lib/api/models/content/base-content";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import {
  getContentBadgeVariant,
  getContentBg,
} from "@/lib/utils/get-content-bg";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import Autoplay from "embla-carousel-autoplay";
import { Eye, Heart, Play, Plus, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

export interface HeroSectionProps {
  readonly featuredList: MediaSeries[];
}

export function HeroSection({ featuredList }: HeroSectionProps) {
  const plugin = useMemo(
    () => Autoplay({ delay: 20000, stopOnInteraction: true }),
    []
  );

  if (!featuredList?.length) return null;

  return (
    <section className="relative w-full group">
      <Carousel
        plugins={[plugin]}
        opts={{
          align: "start",
          loop: true,
          duration: 40, // Thời gian trượt mượt mà hơn
        }}
        className="w-full"
        onMouseEnter={plugin.stop}
        onMouseLeave={plugin.reset}
      >
        <CarouselContent className="ml-0">
          {featuredList.map((featured, index) => (
            <CarouselItem key={featured.id} className="pl-0">
              {/* Pass priority true cho slide đầu tiên để LCP nhanh */}
              <HeroSlide featured={featured} isFirst={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nav Buttons */}
        <div className="absolute inset-y-0 left-4 hidden md:flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-40">
          <CarouselPrevious className="static translate-y-0 size-12 border-white/10 bg-black/20 text-white hover:bg-black/40 hover:border-white/30 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-y-0 right-4 hidden md:flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-40">
          <CarouselNext className="static translate-y-0 size-12 border-white/10 bg-black/20 text-white hover:bg-black/40 hover:border-white/30 backdrop-blur-sm" />
        </div>
      </Carousel>
    </section>
  );
}

function HeroSlide({
  featured,
  isFirst,
}: {
  readonly featured: MediaSeries;
  readonly isFirst: boolean;
}) {
  const t = useTranslations("home");

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 transform-gpu will-change-transform backface-hidden">
      {/* --- BACKGROUND (Giữ nguyên) --- */}
      <div className="absolute inset-0 w-full h-[calc(100%+100px)] top-[-50px] z-0">
        <Image
          src={featured.cover_url}
          alt=""
          fill
          priority={isFirst}
          quality={60}
          sizes="100vw"
          className="object-cover opacity-100 scale-105 blur-3xl saturate-150 translate-z-0 brightness-70"
        />
      </div>

      {/* --- BOTTOM FADE (Giữ nguyên) --- */}
      <div
        className="absolute bottom-0 left-0 w-full z-10 pointer-events-none
        h-64 md:h-96
        bg-linear-to-t from-background from-0% via-background/80 via-30% to-transparent
        translate-z-0"
      />

      {/* --- CONTENT GRID --- */}
      <Container
        maxWidth="xl"
        className="relative z-30 h-dvh md:h-[75vh] min-h-[600px] flex flex-col justify-end pt-20 pb-12 md:py-12 md:pb-24"
      >
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 w-full items-end h-full justify-end">
          {/* --- MOBILE POSTER (BIGGER & BOLDER) --- */}
          {/* flex-1: Để nó chiếm dụng toàn bộ không gian thừa phía trên */}
          <div className="w-full flex justify-center items-center md:hidden order-first relative animate-in fade-in zoom-in duration-1000 ease-out z-30 mb-2 flex-1 min-h-0">
            {/* FIX: Tăng chiều cao lên 45vh hoặc max-h có thể */}
            <div className="relative h-[45vh] w-auto aspect-2/3 rotate-0 hover:rotate-0 transition-transform duration-500 ease-out origin-center shadow-2xl">
              <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl opacity-30 translate-z-0" />
              <AspectRatio
                ratio={2 / 3}
                className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform-gpu h-full w-full"
              >
                <Image
                  src={featured.cover_url}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 400px, 500px"
                  priority={isFirst}
                />
                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
              </AspectRatio>
            </div>
          </div>

          {/* --- CỘT TRÁI: TEXT INFO (Compact hơn để nhường chỗ cho Poster) --- */}
          <div className="w-full md:col-span-7 order-last md:order-first space-y-3 md:space-y-6 mb-0 shrink-0">
            {/* ... (Phần text giữ nguyên, nhưng shrink-0 để không bị co lại khi poster to ra) ... */}

            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge
                variant={getContentBadgeVariant(featured.type, false)}
                className="capitalize"
              >
                {featured.type}
              </Badge>
              {featured.genres.slice(0, 3).map((genre) => (
                <Badge key={genre.id} variant="default">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-shadow-md line-clamp-2">
              {featured.title}
            </h1>

            <div className="text-white text-sm sm:text-base md:text-lg font-semibold max-w-2xl line-clamp-3 md:line-clamp-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-shadow-md">
              <BasicStaticEditorView
                content={featured.description}
                maxLines={4}
              />
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-white py-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 text-sm md:text-base text-shadow-md">
              <div className="flex items-center gap-2 min-w-0 max-w-[60%]">
                <Avatar className="size-8 shrink-0 ring-1 ring-white/30">
                  <AvatarImage
                    src={getImageUrl(featured.owner.avatar_url)}
                    alt={featured.owner.username}
                    loading="lazy"
                  />
                  <AvatarFallback className="text-[9px] text-foreground">
                    {getInitials(featured.owner.display_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold truncate text-white/90 text-shadow-sm">
                  {featured.owner.display_name}
                </span>
              </div>

              <Separator
                orientation="vertical"
                className="h-3! bg-background"
              />

              {/* Stats items */}
              <div className="flex items-center gap-1.5">
                <Star className="size-4" />
                <span className="font-semibold">
                  {formatNumberAbbreviated(featured.rating)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="size-4" />
                <span className="font-semibold">
                  {formatNumberAbbreviated(featured.views)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="size-4" />
                <span className="font-semibold">
                  {formatNumberAbbreviated(featured.favorites)}
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-3 md:gap-4 pt-2 md:pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
              <Button
                className={cn(
                  getContentBg({ type: featured.type, blur: false })
                )}
                asChild
              >
                <Link href={`/series/${featured.slug}`}>
                  <Play className="fill-current h-5 w-5 md:h-6 md:w-6" />
                  {t("common.readNow")}
                </Link>
              </Button>
              <Button variant="outline">
                <Plus className="h-5 w-5 md:h-6 md:w-6" />
                {t("common.addToLibrary")}
              </Button>
            </div>
          </div>

          {/* --- CỘT PHẢI: DESKTOP POSTER --- */}
          <div className="hidden md:block md:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-1000 ease-out z-30">
            {/* Desktop code giữ nguyên */}
            <div className="relative w-[280px] lg:w-[360px] ml-auto mr-4 lg:mr-8 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out origin-bottom-right">
              <div className="absolute -inset-4 bg-white/20 rounded-2xl blur-xl opacity-30 translate-z-0" />
              <AspectRatio
                ratio={2 / 3}
                className="rounded-2xl overflow-hidden shadow-2xl border-4 transform-gpu"
              >
                <Image
                  src={featured.cover_url}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 300px, 380px"
                  priority={isFirst}
                />
                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />
              </AspectRatio>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
