import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ChapterContentWrapper } from "@/features/novel-chapter/components/chapter-content-wrapper";
import { ChapterNavigation } from "@/features/novel-chapter/components/chapter-navigation";
import { getChapter } from "@/features/novel-chapter/queries";
import { getNovelFull } from "@/features/novel/queries";
import { ChapterSummary } from "@/features/novel/types";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TNode } from "platejs";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string; // novel slug
    chapterSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, chapterSlug } = await params;

  try {
    const novel = await getNovelFull(slug);

    // Find chapter in volumes or loose chapters
    let foundChapter: ChapterSummary | undefined;

    // Search in volumes
    for (const volume of novel.volumes) {
      const chapter = volume.chapters.find((c) => c.slug === chapterSlug);
      if (chapter) {
        foundChapter = chapter;
        break;
      }
    }

    // Search in loose chapters if not found
    if (!foundChapter) {
      foundChapter = novel.chapters.find((c) => c.slug === chapterSlug);
    }

    if (!foundChapter) {
      return {
        title: "Chapter not found - WibuTime",
      };
    }

    return {
      title: `${foundChapter.title} - ${novel.title} - WibuTime`,
      description: `Đọc chương ${foundChapter.chapter_number}: ${foundChapter.title} của novel ${novel.title} trên WibuTime`,
    };
  } catch {
    return {
      title: "Error - WibuTime",
    };
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapterSlug } = await params;

  // 1. Fetch Novel Full to context and navigation
  let novel;
  try {
    novel = await getNovelFull(slug);
  } catch {
    notFound();
  }

  // 2. Find Chapter ID
  let foundChapter: ChapterSummary | undefined;

  // Flatten all chapters for navigation
  const allChapters: ChapterSummary[] = [];

  if (novel.volumes.length > 0) {
    novel.volumes.forEach((vol) => {
      allChapters.push(...vol.chapters);
      const chapter = vol.chapters.find((c) => c.slug === chapterSlug);
      if (chapter) {
        foundChapter = chapter;
      }
    });
  }

  // Add loose chapters
  allChapters.push(...novel.chapters);
  if (!foundChapter) {
    const chapter = novel.chapters.find((c) => c.slug === chapterSlug);
    if (chapter) {
      foundChapter = chapter;
    }
  }

  if (!foundChapter) {
    notFound();
  }

  // 3. Fetch Chapter Content
  let chapterData;
  try {
    chapterData = await getChapter(foundChapter.id);
  } catch (error) {
    console.error("Failed to fetch chapter content", error);
    // Even if content fetch fails, we might want to show error state, but for now 404
    notFound();
  }

  // 4. Calculate Navigation
  const currentIndex = allChapters.findIndex((c) => c.id === foundChapter?.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/novels/${slug}`} title="Về trang giới thiệu">
                <Home className="h-5 w-5" />
                <span className="sr-only">Novel Page</span>
              </Link>
            </Button>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                {novel.title}
              </h1>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                Chương {foundChapter.chapter_number}: {foundChapter.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={!prevChapter}
              asChild={!!prevChapter}
            >
              {prevChapter ? (
                <Link
                  href={`/novels/${slug}/chapters/${prevChapter.slug}`}
                  title="Chương trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>

            <ChapterNavigation
              novel={novel}
              currentChapterId={foundChapter.id}
            />

            <Button
              variant="ghost"
              size="icon"
              disabled={!nextChapter}
              asChild={!!nextChapter}
            >
              {nextChapter ? (
                <Link
                  href={`/novels/${slug}/chapters/${nextChapter.slug}`}
                  title="Chương sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-muted-foreground font-medium">
            Chương {foundChapter.chapter_number}
          </h2>
          <h1 className="text-3xl font-bold tracking-tight">
            {foundChapter.title}
          </h1>
        </div>

        <ChapterContentWrapper content={chapterData.content as TNode[]} />

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            disabled={!prevChapter}
            asChild={!!prevChapter}
            className="flex-1"
          >
            {prevChapter ? (
              <Link href={`/novels/${slug}/chapters/${prevChapter.slug}`}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Chương trước
              </Link>
            ) : (
              <span>Chương trước</span>
            )}
          </Button>

          <Button
            variant="outline"
            disabled={!nextChapter}
            asChild={!!nextChapter}
            className="flex-1"
          >
            {nextChapter ? (
              <Link href={`/novels/${slug}/chapters/${nextChapter.slug}`}>
                Chương sau
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <span>Chương sau</span>
            )}
          </Button>
        </div>
      </Container>
    </div>
  );
}
