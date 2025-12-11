/**
 * Community Milestones Section Component
 * Displays platform and community achievements
 */

import { Container } from "@/components/layout/container";
import { Milestone } from "@/features/community";
import { getTranslations } from "next-intl/server";
import { MilestoneCard } from "./milestone-card";

export interface CommunityMilestonesSectionProps {
  /**
   * List of milestones (plain objects from cache)
   */
  readonly milestones: Milestone[];
}

export async function CommunityMilestonesSection({
  milestones,
}: CommunityMilestonesSectionProps) {
  const t = await getTranslations("home");

  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-muted/30">
      <Container maxWidth="xl">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("milestones.title")}
            </h2>
            <p className="text-muted-foreground">{t("milestones.subtitle")}</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </Container>
    </section>
  );
}
