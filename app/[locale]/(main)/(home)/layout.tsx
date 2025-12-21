/**
 * Home Layout
 * Uses parallel routes with bento grid layout
 */

import { Container } from "@/components/layout/container";
import { HomeBentoGrid } from "@/features/home/components/home-bento-grid";
import type { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
  continue: ReactNode;
  top_creator: ReactNode;
  top_genre: ReactNode;
  top_organization: ReactNode;
  top_view: ReactNode;
}

export default async function HomeLayout({
  children,
  continue: continueSection,
  top_creator,
  top_genre,
  top_organization,
  top_view,
}: HomeLayoutProps) {
  return (
    <Container maxWidth="2xl">
      {/* Bento Grid Layout - children is the event section */}
      <HomeBentoGrid
        eventSection={children}
        continueSection={continueSection}
        topCreatorSection={top_creator}
        topGenreSection={top_genre}
        topOrganizationSection={top_organization}
        topViewSection={top_view}
      />
    </Container>
  );
}
