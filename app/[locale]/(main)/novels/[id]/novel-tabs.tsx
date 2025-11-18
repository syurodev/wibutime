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
import { Separator } from "@/components/ui/separator";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import {
  ChevronRight,
  Eye,
  Lock,
  MessageSquare,
  Clock,
} from "lucide-react";
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
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="about"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Giới Thiệu
        </TabsTrigger>
        <TabsTrigger
          value="chapters"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2"
        >
          Chương
          <Badge variant="secondary" className="text-xs font-normal">
            {totalChaptersCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Bình Luận
        </TabsTrigger>
      </TabsList>

      {/* About Tab */}
      <TabsContent value="about" className="mt-8 space-y-8">
        <div className="prose dark:prose-invert max-w-none">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: novel.description }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {novel.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-normal hover:bg-accent cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Chapters Tab */}
      <TabsContent value="chapters" className="mt-8 space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {novel.volumes.length} tập • {totalChaptersCount} chương
          </span>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            Mới nhất
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
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50">
                <div className="flex items-center justify-between w-full text-left pr-3">
                  <span className="font-semibold text-sm">{vol.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {vol.totalChapters} chương
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <Separator className="mb-3" />
                <div className="space-y-1">
                  {vol.chapters.map((chapter: any) => (
                    <Link
                      href={`/read/${novel.slug}/${chapter.id}`}
                      key={chapter.id}
                      className="group block"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                              {chapter.title}
                            </span>
                            {!chapter.isFree && (
                              <Lock className="size-3 text-amber-500 shrink-0" />
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
                        <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}

                  {vol.chapters.length < vol.totalChapters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs h-9"
                    >
                      Xem tất cả {vol.totalChapters} chương
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      {/* Comments Tab */}
      <TabsContent value="comments" className="mt-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted/50 p-4 mb-4">
            <MessageSquare className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Chưa có bình luận</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Hãy là người đầu tiên bình luận về tác phẩm này!
          </p>
          <Button size="sm" className="mt-4">
            Viết bình luận
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
