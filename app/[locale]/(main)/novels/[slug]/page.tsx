/**
 * Novel Detail Page - Server Component
 * Displays full novel information with volumes and chapters
 */

import { Container } from "@/components/layout/container";
import { NovelChapters } from "@/features/novel/components/novel-chapters";
import { NovelHero } from "@/features/novel/components/novel-hero";
import { NovelInfo } from "@/features/novel/components/novel-info";
import { NovelSkeleton } from "@/features/novel/components/novel-skeleton";
import { getNovelFull } from "@/features/novel/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Type definitions
interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const novel = await getNovelFull(slug);
    return {
      title: `${novel.title} - WibuTime`,
      description:
        typeof novel.synopsis === "string"
          ? novel.synopsis.slice(0, 160)
          : `Đọc ${novel.title} trên WibuTime`,
      openGraph: {
        title: novel.title,
        images: novel.cover_image_url ? [novel.cover_image_url] : [],
      },
    };
  } catch {
    return {
      title: "Novel không tìm thấy - WibuTime",
      description: "Novel không tồn tại hoặc đã bị xóa",
    };
  }
}

/**
 * Novel Detail Page Content
 */
async function NovelContent({ slug }: { slug: string }) {
  try {
    const novel = await getNovelFull(slug);
    console.log(novel);
    return (
      <>
        <NovelHero novel={novel} />
        <Container className="py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <NovelChapters novel={novel} />
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <NovelInfo novel={novel} />
            </div>
          </div>
        </Container>
      </>
    );
  } catch {
    notFound();
  }
}

/**
 * Novel Detail Page - Server Component
 */
export default async function NovelDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<NovelSkeleton />}>
        <NovelContent slug={slug} />
      </Suspense>
    </div>
  );
}
