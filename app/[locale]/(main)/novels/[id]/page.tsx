/**
 * Novel Detail Page - Server Component
 * Displays detailed information about a novel including synopsis, volumes, chapters, and reviews
 */

import { Container } from "@/components/layout/Container";
import { Separator } from "@/components/ui/separator";
import { NovelUtils } from "@/lib/api/models/content/novel";
import { NovelService } from "@/lib/api/services/novel/novel.service";
import type { Metadata } from "next";
import { NovelHeroSection } from "./components/NovelHeroSection";
import { NovelReviews } from "./components/NovelReviews";
import { NovelSidebar } from "./components/NovelSidebar";
import { NovelSynopsis } from "./components/NovelSynopsis";
import { NovelVolumesAccordion } from "./components/NovelVolumesAccordion";

// Type definitions
interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const novel = await NovelService.getNovelDetail(id);

  return {
    title: `${novel.title} - WibuTime`,
    description: `Read ${novel.title} by ${novel.author}. ${novel.type} with ${novel.volumes.length} volumes. Rating: ${novel.rating}/5.0`,
    openGraph: {
      title: novel.title,
      description: novel.original_title,
      images: [novel.cover_url],
    },
  };
}

/**
 * Novel Detail Page - Server Component
 */
export default async function NovelDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch novel data from service
  const novel = await NovelService.getNovelDetail(id);

  // Calculate total chapters
  const totalChapters = NovelUtils.getTotalChapters(novel);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <NovelHeroSection
        id={novel.id}
        title={novel.title}
        originalTitle={novel.original_title}
        coverUrl={novel.cover_url}
        author={novel.author}
        type={novel.type}
        status={novel.status}
        genres={novel.genres}
        rating={novel.rating}
        ratingCount={novel.rating_count}
        views={novel.views}
        favorites={novel.favorites}
        isBookmarked={false} // TODO: Fetch from user's library
      />

      {/* Content Section */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Synopsis */}
            <NovelSynopsis description={novel.description} tags={novel.tags} />

            <Separator />

            {/* Volumes & Chapters */}
            <NovelVolumesAccordion
              novelSlug={novel.slug}
              volumes={novel.volumes}
            />

            <Separator />

            {/* Reviews */}
            <NovelReviews
              rating={novel.rating}
              ratingCount={novel.rating_count}
              reviews={novel.reader_comments}
            />
          </div>

          {/* Sidebar */}
          <NovelSidebar
            author={novel.author}
            artist={novel.artist}
            releaseYear={novel.release_year}
            status={novel.status}
            volumesCount={novel.volumes.length}
            chaptersCount={totalChapters}
            recommendations={novel.recommendations}
          />
        </div>
      </Container>
    </div>
  );
}
