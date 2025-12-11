/**
 * Novels Landing Page
 * Dedicated page for novel content
 *
 * TODO: Implement API endpoints for novel-specific data fetching
 */

import { Container } from "@/components/layout/container";
import type { Metadata } from "next";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
  title: "Novels - WibuTime",
  description:
    "Read the best light novels, web novels, and original fiction on WibuTime.",
  keywords: ["novel", "light novel", "web novel", "read online", "wibutime"],
};

/**
 * Novels Page Server Component
 * TODO: Add content when API endpoints are ready
 */
export default async function NovelsPage() {
  return (
    <div className="min-h-screen pb-24">
      <Container className="py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Novels</h1>
          <p className="text-muted-foreground">
            Coming soon - API endpoints under development
          </p>
        </div>
      </Container>
    </div>
  );
}
