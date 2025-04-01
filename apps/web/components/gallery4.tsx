'use client';

import { ITopNovel } from '@/commons/interfaces/novels/top-novel';
import { ContentColorUtil } from '@/commons/utils/content-color.util';
import { StringUtil } from '@/commons/utils/string.util';
import { cn } from '@/commons/utils/tailwind.util';
import { useScreenSize } from '@/hooks/use-screen-size';
import { CONTENT_TYPE } from '@workspace/types';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@workspace/ui/components/carousel';
import { Pill, PillStatus } from '@workspace/ui/components/pill';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Crown, Eye, Vote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ContentRenderer from './ContentRenderer';

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  items: ITopNovel[];
}
const Gallery4 = ({ items = [] }: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const screenSize = useScreenSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const topElementsRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState('auto');

  useEffect(() => {
    if (!containerRef.current || !topElementsRef.current) return;

    const updateHeight = () => {
      const containerHeight = containerRef.current!.clientHeight;
      const topElementsHeight = topElementsRef.current!.clientHeight;
      const availableHeight = containerHeight - topElementsHeight;

      // Font size và line-height theo Tailwind
      const lineHeight = screenSize.greaterThan('xs') ? 28 : 24;

      // Tính số dòng hiển thị trọn vẹn
      const maxLines = Math.floor(availableHeight / lineHeight);

      // Đặt max-height theo số dòng
      setContentHeight(`${maxLines * lineHeight}px`);
    };

    // Khởi tạo ResizeObserver
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(containerRef.current);

    // Cập nhật ngay khi render
    updateHeight();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= items.length) {
          carouselApi.scrollTo(0);
          setCanScrollPrev(carouselApi.canScrollPrev());
          setCanScrollNext(carouselApi.canScrollNext());
          return 0;
        } else {
          carouselApi.scrollTo(nextIndex);
          setCanScrollPrev(carouselApi.canScrollPrev());
          setCanScrollNext(carouselApi.canScrollNext());
          return nextIndex;
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [carouselApi, items.length, currentSlide]);

  const getContentTypeString = (type: CONTENT_TYPE) => {
    if (type === CONTENT_TYPE.ANIME) {
      return 'anime';
    } else if (type === CONTENT_TYPE.MANGA) {
      return 'manga';
    } else {
      return 'lightnovel';
    }
  };

  const handleItemClick = (index: number) => {
    setCurrentSlide(index);
    if (!carouselApi) return;
    carouselApi.scrollTo(index);
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  };

  return (
    <section className="pt-10 pb-10 relative h-dvh min-h-[750px] flex gap-3 flex-col justify-between">
      {/* Info */}
      <div
        ref={containerRef}
        className="container mx-auto z-10 relative flex-1 overflow-hidden px-4 h-full"
      >
        <div className="flex items-start h-full justify-between md:mb-6 lg:mb-8">
          <div className="flex flex-col gap-4">
            <div ref={topElementsRef} className="flex flex-col gap-4 leading-">
              <div className="drop-shadow-text-xs text-sm md:text-md lg:text-lg uppercase font-semibold flex items-center justify-start gap-1">
                <span
                  className={cn(
                    'font-bold',
                    new ContentColorUtil(
                      items[currentSlide]!.type,
                    ).getTextColor(),
                  )}
                >
                  {getContentTypeString(items[currentSlide]!.type)}
                </span>
                <span>Spotlight</span>
                <Crown className="size-4 text-yellow-500" />
                <span>Weekly Top Pick</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentSlide}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-3xl font-semibold font-serif md:text-4xl lg:text-5xl line-clamp-3"
                >
                  {items[currentSlide]!.title}
                </motion.h2>
              </AnimatePresence>

              <div className="flex gap-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeInOut',
                      delay: 0,
                    }}
                    className="flex gap-2"
                  >
                    <Pill
                      variant={'outline'}
                      className={
                        items[currentSlide]!.type === CONTENT_TYPE.NOVEL
                          ? 'border-novel-color'
                          : items[currentSlide]!.type === CONTENT_TYPE.MANGA
                            ? 'border-manga-color'
                            : 'border-anime-color'
                      }
                    >
                      <PillStatus
                        className={
                          items[currentSlide]!.type === CONTENT_TYPE.NOVEL
                            ? 'border-r-novel-color'
                            : items[currentSlide]!.type === CONTENT_TYPE.MANGA
                              ? 'border-r-manga-color'
                              : 'border-r-anime-color'
                        }
                      >
                        <Vote
                          size={12}
                          className={new ContentColorUtil(
                            items[currentSlide]!.type,
                          ).getTextColor()}
                        />
                        {items[currentSlide]!.average_score}
                      </PillStatus>
                      {items[currentSlide]!.vote_count} votes
                    </Pill>

                    <Pill
                      variant={'outline'}
                      className={
                        items[currentSlide]!.type === CONTENT_TYPE.NOVEL
                          ? 'border-novel-color'
                          : items[currentSlide]!.type === CONTENT_TYPE.MANGA
                            ? 'border-manga-color'
                            : 'border-anime-color'
                      }
                    >
                      <Eye className="size-3" />
                      {items[currentSlide]!.views}
                    </Pill>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Genres */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                    delay: 0,
                  }}
                  className="flex gap-2 flex-wrap"
                >
                  {items[currentSlide]!.genres.map((genre) => (
                    <Badge key={genre.id} className="text-nowrap">
                      {genre.name}
                    </Badge>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                  delay: 0,
                }}
                style={{ maxHeight: contentHeight }}
              >
                <ContentRenderer
                  content={items[currentSlide]!.summary}
                  boxClassName={cn(
                    'mx-0 max-w-full px-0 py-0 overflow-hidden rounded-none',
                  )}
                  textClassName={
                    'text-xs md:text-sm font-serif font-normal !leading-6 !md:leading-7'
                  }
                  style={{ maxHeight: contentHeight }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex absolute bottom-0 right-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full z-10 relative">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 mt-2 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className={cn(
                  'max-w-[190px] md:max-w-[220px] pl-[20px] lg:max-w-[240px] transition-all ease-in-out duration-300',
                  index === currentSlide ? 'scale-100' : 'scale-95 md:scale-90',
                )}
                onClick={() => handleItemClick(index)}
              >
                <div className="group rounded-xl">
                  <div
                    className={cn(
                      'group relative h-full min-h-[16rem] md:min-h-[18rem] max-w-full overflow-hidden rounded-xl aspect-[2/3]',
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={new StringUtil(
                          item.cover_image_url,
                        ).imageWithDefault()}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 190px, (max-width: 1024px) 220px, 240px"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105 "
                      />
                    </div>

                    <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                      {/* <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4 line-clamp-3">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Error magnam earum saepe sint. Aliquam maxime
                        consequatur non corrupti, tempore commodi magnam aliquid
                        tempora impedit aspernatur recusandae? Necessitatibus,
                        nobis? Minima, optio!
                      </div> */}
                      {/* <div className="flex items-center text-sm">
                        Read more{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-[5px] h-[5px] transition-all duration-500 ease-in-out rounded-full ${
                currentSlide === index
                  ? `${
                      items[currentSlide]!.type === CONTENT_TYPE.NOVEL
                        ? 'bg-novel-color'
                        : items[currentSlide]!.type === CONTENT_TYPE.ANIME
                          ? 'bg-anime-color'
                          : 'bg-manga-color'
                    } !w-[25px]`
                  : 'bg-primary/20 hover:bg-primary/50 hover:w-[15px]'
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.2, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={new StringUtil(
                items[currentSlide]?.cover_image_url,
              ).imageWithDefault()}
              alt={items[currentSlide]?.title || ''}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            items[currentSlide]!.type === CONTENT_TYPE.NOVEL
              ? 'from-novel-color/20'
              : items[currentSlide]!.type === CONTENT_TYPE.ANIME
                ? 'from-anime-color/20'
                : 'from-manga-color/20'
          } via-background to-background backdrop-blur-sm`}
        />
      </div>
    </section>
  );
};

export { Gallery4 };
