import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import type { NovelVolume } from "@/lib/api/models/content/novel";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { ChevronRight, Clock, Eye, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface NovelVolumesAccordionProps {
  novelSlug: string;
  volumes: NovelVolume[];
}

export async function NovelVolumesAccordion({
  novelSlug,
  volumes,
}: NovelVolumesAccordionProps) {
  const t = await useTranslations("novel.detail");

  const totalChapters = volumes.reduce(
    (sum, vol) => sum + vol.chapter_count,
    0
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("volumesAndChapters")}</h2>
        <p className="text-sm text-muted-foreground">
          {volumes.length} {t("volumes")} • {totalChapters} {t("chapters")}
        </p>
      </div>

      {/* Volumes Accordion */}
      <Accordion
        type="multiple"
        defaultValue={[volumes[0]?.id]}
        className="space-y-4"
      >
        {volumes.map((volume, volumeIndex) => (
          <AccordionItem
            key={volume.id}
            value={volume.id}
            className="border rounded-xl overflow-hidden bg-card"
          >
            {/* Volume Header */}
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/30">
              <div className="flex items-center gap-4 w-full text-left pr-4">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted border shadow-sm">
                  <Image
                    src={volume.cover_image_url || "/images/placeholder.jpg"}
                    alt={volume.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1">{volume.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {volume.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <Badge variant="secondary" className="font-normal">
                    {volume.chapter_count} chapters
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>

            {/* Volume Chapters */}
            <AccordionContent className="px-6 pb-4">
              <div className="border-t pt-4 space-y-2">
                {volume.chapters.map((chapter, chapterIndex) => (
                  <Link
                    href={`/read/${novelSlug}/${chapter.id}`}
                    key={chapter.id}
                    className="group block"
                  >
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm font-medium text-muted-foreground shrink-0 w-8">
                          {volumeIndex * 6 + chapterIndex + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                              {chapter.title}
                            </h4>
                            {!chapter.is_free && (
                              <Lock className="size-4 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {chapter.created_at}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="size-3" />
                              {formatNumberAbbreviated(chapter.views)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
