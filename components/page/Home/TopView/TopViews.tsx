"use client";

import React, { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentCard from "@/components/shared/Card/CardContent";
import { AnimatePresence } from "framer-motion";
import DivSlide from "@/components/shared/Animation/DivSlide";

type IProps = {
  data: {
    animes: ContentCardType[];
    mangas: ContentCardType[];
    lightnovels: ContentCardType[];
  };
};

const TopViews: React.FC<IProps> = ({ data }) => {
  const [contentType, setContentType] = useState<ContentType>("anime");

  return (
    <DivSlide
      delay={0.5}
      className="rounded-xl border bg-card text-card-foreground shadow transition-colors duration-300 flex-none relative h-fit"
    >
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>Top Views</CardTitle>
        <ToggleGroup
          type="single"
          // defaultValue={contentType}
          value={contentType}
          onValueChange={(e) =>
            setContentType(!e ? "anime" : (e as ContentType))
          }
          className="!mt-0"
        >
          <ToggleGroupItem
            value="anime"
            aria-label="Toggle anime"
            className="rounded-full !mt-0"
          >
            Anime
          </ToggleGroupItem>
          <ToggleGroupItem
            value="manga"
            aria-label="Toggle manga"
            className="rounded-full !mt-0"
          >
            Manga
          </ToggleGroupItem>
          <ToggleGroupItem
            value="lightnovel"
            aria-label="Toggle lightnovel"
            className="rounded-full !mt-0"
          >
            Lightnovel
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center overflow-hidden">
        <AnimatePresence mode="wait">
          {contentType === "anime"
            ? data.animes.map((item, index) => (
                <DivSlide
                  key={`${contentType}-${item.url_id}`}
                  delay={0.05 + index / 15}
                >
                  <ContentCard data={item} />
                </DivSlide>
              ))
            : contentType === "manga"
            ? data.mangas.map((item, index) => (
                <DivSlide
                  key={`${contentType}-${item.url_id}`}
                  delay={0.05 + index / 15}
                >
                  <ContentCard data={item} />
                </DivSlide>
              ))
            : contentType === "lightnovel"
            ? data.lightnovels.map((item, index) => (
                <DivSlide
                  key={`${contentType}-${item.url_id}`}
                  delay={0.05 + index / 15}
                >
                  <ContentCard data={item} />
                </DivSlide>
              ))
            : null}
        </AnimatePresence>
      </CardContent>
    </DivSlide>
  );
};

export default TopViews;
