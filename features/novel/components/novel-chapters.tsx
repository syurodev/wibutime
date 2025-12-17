/**
 * Novel Chapters Section - Server Component
 * Displays volumes and chapters in an accordion layout
 */

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  ChapterSummary,
  NovelFullResponse,
  VolumeWithChapters,
} from "@/features/novel/types";
import { BookOpen, ChevronRight, List } from "lucide-react";
import Link from "next/link";

interface NovelChaptersProps {
  readonly novel: NovelFullResponse;
}

interface ChapterItemProps {
  readonly chapter: ChapterSummary;
  readonly novelSlug: string;
}

function ChapterItem({ chapter, novelSlug }: ChapterItemProps) {
  return (
    <Link
      href={`/novels/${novelSlug}/chapters/${chapter.slug}`}
      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-muted-foreground w-12 flex-shrink-0">
          #{chapter.chapter_number}
        </span>
        <span className="text-sm truncate">{chapter.title}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Link>
  );
}

interface VolumeAccordionProps {
  readonly volume: VolumeWithChapters;
  readonly novelSlug: string;
  readonly defaultOpen?: boolean;
}

function VolumeAccordion({
  volume,
  novelSlug,
  defaultOpen,
}: VolumeAccordionProps) {
  return (
    <AccordionItem value={volume.id} className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <div className="text-left">
            <p className="font-semibold">
              Tập {volume.volume_number}: {volume.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {volume.chapters.length} chương
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="divide-y">
          {volume.chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              novelSlug={novelSlug}
            />
          ))}
        </div>
        {volume.chapters.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có chương nào
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export function NovelChapters({ novel }: NovelChaptersProps) {
  const hasVolumes = novel.volumes.length > 0;
  const hasLooseChapters = novel.chapters.length > 0;
  const totalChapters =
    novel.volumes.reduce((sum, vol) => sum + vol.chapters.length, 0) +
    novel.chapters.length;

  // Find first volume with chapters
  const firstVolumeWithChapters = novel.volumes.find(
    (v) => v.chapters.length > 0
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <List className="w-5 h-5" />
          Danh sách chương
          <Badge variant="secondary">{totalChapters}</Badge>
        </CardTitle>
        <Button variant="outline" size="sm">
          Sắp xếp
        </Button>
      </CardHeader>
      <CardContent>
        {/* No content case */}
        {!hasVolumes && !hasLooseChapters && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có chương nào</p>
          </div>
        )}

        {/* Volumes */}
        {hasVolumes && (
          <Accordion
            type="single"
            collapsible
            defaultValue={firstVolumeWithChapters?.id}
            className="space-y-2"
          >
            {novel.volumes.map((volume) => (
              <VolumeAccordion
                key={volume.id}
                volume={volume}
                novelSlug={novel.slug}
              />
            ))}
          </Accordion>
        )}

        {/* Separate section for loose chapters (no volume) */}
        {hasLooseChapters && (
          <div className="mt-6">
            {hasVolumes && (
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Chương lẻ
                <Badge variant="outline">{novel.chapters.length}</Badge>
              </h3>
            )}
            <ScrollArea className="max-h-[400px]">
              <div className="divide-y pr-4">
                {novel.chapters.map((chapter) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    novelSlug={novel.slug}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
