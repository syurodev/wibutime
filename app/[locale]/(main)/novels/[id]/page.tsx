/**
 * Novel Detail Page - Server Component
 * Displays detailed information about a novel
 *
 * TODO: Implement API endpoint for novel detail fetching
 */

import { Container } from "@/components/layout/container";
import type { Metadata } from "next";

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

  // TODO: Fetch real novel data when API is ready
  return {
    title: `Novel ${id} - WibuTime`,
    description: "Novel details coming soon",
  };
}

/**
 * Novel Detail Page - Server Component
 * TODO: Add content when API endpoint is ready
 */
export default async function NovelDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Novel: {id}
          </h1>
          <p className="text-muted-foreground">
            Coming soon - API endpoint under development
          </p>
        </div>
      </Container>
    </div>
  );
}
