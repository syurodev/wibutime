"use client";
import React from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import DivSlide from "@/components/shared/Animation/DivSlide";
import H3Slide from "@/components/shared/Animation/H3Slide";
import H5Slide from "@/components/shared/Animation/H5Slide";
import SummarySlide from "@/components/shared/Animation/SummarySlide";
import { AnimatePresence } from "framer-motion";

type IProps = {
  data: New[];
};

const HomeNews: React.FC<IProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (data && data && data.length > 1) {
      const interval = setInterval(() => {
        if (currentIndex >= data!.length! - 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentIndex, data]);

  return (
    <AnimatePresence mode="wait">
      {data &&
        data.length > 0 &&
        data.map((item, index) => {
          return (
            index === currentIndex && (
              <div
                key={item.id}
                className="h-[calc(100dvh-94px)] flex flex-col md:flex-row gap-4"
              >
                <div className="flex-auto z-10 flex flex-col md:flex-[3] gap-3">
                  <H3Slide
                    delay={0.2}
                    className="font-serif font-normal text-4xl md:text-6xl uppercase text-pretty line-clamp-3 md:line-clamp-4"
                  >
                    {item.name}
                  </H3Slide>

                  <SummarySlide
                    delay={0.25}
                    className="font-serif line-clamp-3 text-sm md:line-clamp-[20]"
                  >
                    {/* TODO change this */}
                    {item.summary}
                  </SummarySlide>

                  <H5Slide
                    delay={0.3}
                    className="text-sm font-serif line-clamp-1 md:line-clamp-2"
                  >
                    <span className="font-semibold">Chapter:</span>{" "}
                    {item.current}
                  </H5Slide>

                  <div className="flex gap-1 flex-wrap">
                    {item.categories.map((category, index) => {
                      return (
                        <DivSlide
                          key={category.id}
                          delay={0.3 + index * 0.045}
                          className="w-fit h-fit"
                        >
                          <Badge
                            variant={`${item.type}Outline`}
                            className="rounded-full"
                          >
                            {category.name}
                          </Badge>
                        </DivSlide>
                      );
                    })}
                  </div>
                </div>

                <DivSlide
                  delay={0.5}
                  className="relative aspect-[2/3] w-full md:w-[calc(100%-88px)] overflow-hidden rounded-xl max-h-[calc(100dvh-88px)] flex-auto md:flex-[2] bottom-0 z-0 shadow border"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    priority
                    sizes="full"
                    className="object-cover"
                  />
                </DivSlide>
              </div>
            )
          );
        })}
    </AnimatePresence>
  );
};

export default HomeNews;
