"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HistoryCard } from "@/features/history/components/HistoryCard";
import type { HistoryMedia } from "@/features/history/types/history-content";

export interface ContinueCarouselProps {
  readonly history: HistoryMedia[];
}

export function ContinueCarousel({ history }: ContinueCarouselProps) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="relative"
    >
      <CarouselContent className="-ml-4">
        {history.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <HistoryCard item={item} className="h-full" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
