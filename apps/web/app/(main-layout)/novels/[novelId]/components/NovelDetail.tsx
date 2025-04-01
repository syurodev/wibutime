"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { type INovelDetail } from "@/commons/interfaces/novels/novel-detail";
import { VolumeSummary } from "@/commons/interfaces/novels/volume-summary";
import { slide } from "@/commons/utils/motion.util";
import { cn } from "@/commons/utils/tailwind.util";
import { useScreenSize } from "@/hooks/use-screen-size";

export interface NovelDetailProps {
  data: INovelDetail["volumes"];
}

export function NovelDetail({ data }: NovelDetailProps) {
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [chuckIndexActive, setChuckIndexActive] = useState<number | null>(null);
  const [chuckItem, setChuckItem] = useState<VolumeSummary[][]>([]);
  const screenSize = useScreenSize();

  useEffect(() => {
    const size = screenSize.greaterThan("sm") ? 10 : 5;

    setChuckItem(
      Array.from({ length: Math.ceil(data.length / size) }, (_, index) =>
        data.slice(index * size, index * size + size)
      )
    );
  }, [screenSize.greaterThan("sm"), data]);

  useEffect(() => {
    if (activeId && itemRefs.current[activeId]) {
      itemRefs.current[activeId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeId]);

  return (
    <>
      <div className="flex flex-col gap-10 items-center justify-center w-full max-w-[1200px] mx-auto py-24">
        {chuckItem.map((x, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex gap-2 lg:gap-4 p-4 w-full items-center justify-center",
                chuckIndexActive === index &&
                  (!screenSize.greaterThan("xs") ? "gap-0" : "gap-2")
              )}
            >
              {x.map((item) => {
                const isHover = hoverId === item.id;
                const isActive = activeId === item.id;

                return (
                  // Container NGOÀI - không overflow-hidden
                  <div
                    key={item.id}
                    ref={(el: HTMLDivElement | null) => {
                      itemRefs.current[item.id] = el;
                    }}
                    className={cn(
                      "group relative transition-all duration-500 ease-in-out rounded-sm shadow-lg overflow-hidden border z-40",
                      // Chiều rộng cố định
                      "w-[50px]",
                      // Chiều cao
                      "lg:h-[300px] h-[250px]",
                      // Hiệu ứng nâng lên khi hover
                      isHover && "translate-y-[-30px]",
                      isActive && "w-full lg:h-[500px] h-dvh",
                      activeId &&
                        !isActive &&
                        chuckIndexActive === index &&
                        "lg:opacity-30 lg:blur-sm lg:pointer-events-none lg:w-4 w-0"
                    )}
                    style={{ transformOrigin: "bottom" }}
                    onMouseEnter={() => {
                      if (isActive) return;
                      setHoverId(item.id);
                    }}
                    onMouseLeave={() => {
                      if (isActive) return;
                      setHoverId(null);
                    }}
                    onClick={() => {
                      if (isActive) return;
                      setActiveId(item.id);
                      setChuckIndexActive(index);
                      setHoverId(null);
                    }}
                  >
                    {/* Container TRONG - overflow-hidden, bo góc, chỉ chứa ảnh */}
                    <div
                      className={cn(
                        "relative h-full w-full overflow-hidden rounded-sm"
                      )}
                    >
                      <div
                        className={cn(
                          "relative h-full w-full overflow-hidden rounded-sm transition-all duration-300 line-clamp-1"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute w-full h-full z-10 backdrop-blur-md opacity-0 transition-all duration-300 bg-secondary ease-in-out",
                            isActive && "opacity-100"
                          )}
                        />
                        <Image
                          src={item.cover_image_url}
                          alt="Image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={cn(
                            "object-cover opacity-100 transition-all duration-500 z-0 ease-in-out brightness-100",
                            isActive && "opacity-0",
                            isHover && "brightness-50"
                          )}
                          priority
                        />
                        <p
                          className={cn(
                            "z-20 text-nowrap font-serif font-semibold absolute rotate-180 left-1/2 -translate-x-1/2 -bottom-8 opacity-0 transition-all duration-300 ease-in-out overflow-hidden text-ellipsis whitespace-nowrap lg:max-h-[300px] max-h-[250px] p-4",
                            isHover && "bottom-0 opacity-100",
                            isActive && "opacity-0"
                          )}
                          style={{ writingMode: "vertical-lr" }}
                        >
                          {item.title}
                        </p>
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent z-10 -bottom-12 opacity-0 transition-all duration-300 ease-in-out",
                            isHover && "bottom-0 opacity-100",
                            isActive && "opacity-0"
                          )}
                        />
                      </div>

                      {/* CONTENT */}
                      <div
                        className={cn(
                          "flex md:flex-row flex-col opacity-0 z-30 absolute w-full h-full top-0 transition-all duration-300",
                          isActive && "opacity-100"
                        )}
                      >
                        <div
                          className={cn(
                            "relative aspect-[2/3] w-auto md:max-w-[400px] transition-all opacity-100 duration-300",
                            !isActive && "opacity-0"
                          )}
                        >
                          <Image
                            src={item.cover_image_url}
                            alt="Image"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                        {isActive && (
                          <div
                            className={cn(
                              "w-full h-full transition-all opacity-100 duration-300 ease-in-out p-4",
                              !isActive && "w-0 opacity-0"
                            )}
                          >
                            <motion.h1
                              initial={slide.initial}
                              animate={slide.animate(0.3)}
                              exit={slide.exit()}
                              className="text-center font-serif font-semibold text-lg"
                            >
                              {item.title}
                            </motion.h1>
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          "w-full h-full transition-all duration-500 ease-in-out",
                          !isActive && "w-0"
                        )}
                      >
                        <h1>dwedwedw</h1>
                      </div>
                    </div>

                    {/* VÒNG TRÒN - tuyệt đối, nằm trong container ngoài, không bị cắt */}
                    <div
                      className={cn(
                        "absolute left-1/2 size-3 rounded-full border-primary border-solid border-2 shadow-lg ease-in-out",
                        // Vị trí ban đầu ẩn dưới
                        "-bottom-12 -translate-x-1/2",
                        // Ẩn ban đầu
                        "opacity-0 transition-all duration-300",
                        // Khi hover
                        "group-hover:opacity-100 group-hover:-bottom-7",
                        activeId && "hidden"
                      )}
                    />

                    {/* TITLE - tuyệt đối, nằm trong container ngoài, không bị cắt */}
                    {/* <div
                    className={cn(
                      "absolute left-1/2 top-0 -translate-x-1/2 px-2 py-1 ease-in-out",
                      "text-primary text-sm rounded whitespace-nowrap",
                      // Ẩn ban đầu
                      "opacity-0 transition-all duration-300",
                      // Dịch chuyển lên trên khi hover
                      "group-hover:opacity-100 group-hover:-translate-y-full",
                      activeId && "hidden"
                    )}
                  >
                    {item.title}
                  </div> */}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "-z-30 bg-background/50 opacity-0 backdrop-blur-sm absolute w-full h-full top-0 left-0 transition-all duration-500",
          activeId && "opacity-100 z-30"
        )}
        onClick={() => {
          setActiveId(null);
          setChuckIndexActive(null);
          setHoverId(null);
        }}
      />
    </>
  );
}
