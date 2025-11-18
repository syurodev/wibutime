"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { ChevronRight, Eye, Lock, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

interface NovelTabsProps {
  novel: any;
}

export function NovelTabs({ novel }: NovelTabsProps) {
  const totalChaptersCount = novel.volumes.reduce(
    (acc: number, vol: any) => acc + vol.totalChapters,
    0
  );

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-transparent mb-8">
        <TabsTrigger
          value="about"
          className="font-serif rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d2d2d] data-[state=active]:bg-transparent text-base pb-3"
        >
          About
        </TabsTrigger>
        <TabsTrigger
          value="chapters"
          className="font-serif rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d2d2d] data-[state=active]:bg-transparent text-base pb-3 gap-2"
        >
          Chapters
          <Badge
            variant="secondary"
            className="bg-gray-100 text-[#2d2d2d] text-xs font-normal border-0"
          >
            {totalChaptersCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="font-serif rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d2d2d] data-[state=active]:bg-transparent text-base pb-3"
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      {/* About Tab */}
      <TabsContent value="about" className="space-y-8">
        {/* Genres */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#2d2d2d]">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {novel.genres.map((genre: any) => (
              <Badge
                key={genre.id}
                className="bg-white border border-gray-200 text-[#2d2d2d] hover:bg-gray-50 text-sm font-normal px-4 py-1.5"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#2d2d2d]">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {novel.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-gray-200 text-[#666] hover:bg-gray-50 text-sm font-normal px-3 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#2d2d2d]">Synopsis</h3>
          <div className="prose max-w-none">
            <p className="text-[#666] leading-relaxed">
              {novel.description}
            </p>
            <p className="text-[#666] leading-relaxed mt-4">
              Follow Harry Potter as he embarks on his second year at Hogwarts
              School of Witchcraft and Wizardry. With dark forces at work and a
              mysterious chamber that has been opened, Harry must uncover the
              truth behind the attacks on students before it's too late.
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Chapters Tab */}
      <TabsContent value="chapters" className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666]">
            {novel.volumes.length} volume{novel.volumes.length > 1 ? "s" : ""} •{" "}
            {totalChaptersCount} chapters
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-[#666] hover:text-[#2d2d2d]"
          >
            Sort by newest
          </Button>
        </div>

        <Accordion
          type="multiple"
          className="space-y-4"
          defaultValue={[novel.volumes[0].id]}
        >
          {novel.volumes.map((vol: any) => (
            <AccordionItem
              key={vol.id}
              value={vol.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50/50">
                <div className="flex items-center justify-between w-full text-left pr-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-[#2d2d2d] flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-[#2d2d2d]">
                        {vol.title}
                      </span>
                      <span className="text-xs text-[#999]">
                        {vol.totalChapters} chapters
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4">
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  {vol.chapters.map((chapter: any) => (
                    <Link
                      href={`/read/${novel.slug}/${chapter.id}`}
                      key={chapter.id}
                      className="group block"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#e85d4d] transition-colors truncate">
                              {chapter.title}
                            </span>
                            {!chapter.isFree && (
                              <Lock className="size-3 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#999]">
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
                        <ChevronRight className="size-4 text-[#999] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}

                  {vol.chapters.length < vol.totalChapters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs h-9 text-[#666] hover:text-[#2d2d2d] hover:bg-gray-50"
                    >
                      View all {vol.totalChapters} chapters
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="space-y-6">
        {/* Rating Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#2d2d2d] mb-2">
                {novel.rating}
              </div>
              <div className="flex items-center gap-1 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`size-5 ${
                      star <= Math.round(novel.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#999]">
                {formatNumberAbbreviated(novel.ratingCount)} ratings
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs text-[#666] w-8">{stars} ★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : 2}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#999] w-12 text-right">
                    {stars === 5 ? "70%" : stars === 4 ? "20%" : stars === 3 ? "8%" : "2%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <Button className="w-full bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white">
          Write a Review
        </Button>

        {/* Reviews List Placeholder */}
        <div className="text-center py-12">
          <p className="text-[#999] text-sm">
            No reviews yet. Be the first to review this book!
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
