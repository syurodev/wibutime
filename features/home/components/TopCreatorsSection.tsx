/**
 * Top Creators Section Component
 * Displays popular creators with their stats
 */

import { Container } from "@/components/layout/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreatorStats, CreatorStatsUtils } from "@/features/community";
import { BasicStaticEditorView } from "@/features/editor/components/basic-static-editor-view";
import { Link } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { getInitials } from "@/lib/utils/get-initials";
import { ArrowRight, BadgeCheck, BookOpen, Eye, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export interface TopCreatorsSectionProps {
  /**
   * List of top creators (plain objects from cache)
   */
  readonly creators: CreatorStats[];
}

export async function TopCreatorsSection({
  creators,
}: TopCreatorsSectionProps) {
  const t = await getTranslations("home");

  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <Container maxWidth="xl">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("topCreators.title")}
            </h2>
            <p className="text-muted-foreground">{t("topCreators.subtitle")}</p>
          </div>

          {/* See All Link */}
          <Button variant="ghost" className="group gap-2" asChild>
            <Link href="/creators">
              {t("common.seeAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Individual Creator Card
 */
function CreatorCard({ creator }: { readonly creator: CreatorStats }) {
  const t = (key: string) => {
    // Simple translation helper for card
    const translations: Record<string, string> = {
      followers: "Followers",
      works: "Works",
      views: "Views",
    };
    return translations[key] || key;
  };

  return (
    <Link href={`/creator/${creator.username}`}>
      <div className="group relative rounded-[20px] border-4 border-secondary bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full overflow-hidden">
        <div className="p-6">
          {/* Creator Avatar & Name */}
          <div className="flex flex-col items-center gap-4">
            {/* Avatar with verified badge */}
            <div className="relative">
              <Avatar className="size-20 ring-2 ring-primary/10">
                <AvatarImage
                  src={getImageUrl(creator.avatar_url)}
                  alt={creator.display_name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(creator.display_name)}
                </AvatarFallback>
              </Avatar>
              {creator.is_verified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                  <BadgeCheck className="size-5 fill-primary text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Creator Name */}
            <div className="text-center space-y-1 w-full">
              <h3 className="font-bold text-lg line-clamp-1">
                {creator.display_name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                @{creator.username}
              </p>
            </div>
          </div>

          {/* Bio (if available) */}
          {creator.bio && (
            <div className="mt-4 text-center">
              <BasicStaticEditorView
                content={creator.bio}
                maxLines={2}
                className="text-sm text-muted-foreground"
              />
            </div>
          )}

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {/* Followers */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Users className="size-3.5" />
              </div>
              <p className="text-sm font-bold">
                {CreatorStatsUtils.formatFollowers(creator.follower_count)}
              </p>
              <p className="text-xs text-muted-foreground">{t("followers")}</p>
            </div>

            {/* Works */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <BookOpen className="size-3.5" />
              </div>
              <p className="text-sm font-bold">{creator.works_count}</p>
              <p className="text-xs text-muted-foreground">{t("works")}</p>
            </div>

            {/* Total Views */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Eye className="size-3.5" />
              </div>
              <p className="text-sm font-bold">
                {CreatorStatsUtils.formatViews(creator.total_views)}
              </p>
              <p className="text-xs text-muted-foreground">{t("views")}</p>
            </div>
          </div>

          {/* Popular Work Preview (if available) */}
          {creator.popular_work_title && creator.popular_work_cover_url && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="relative size-10 rounded overflow-hidden shrink-0">
                  <Image
                    src={creator.popular_work_cover_url}
                    alt={creator.popular_work_title}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Popular work</p>
                  <p className="text-sm font-medium line-clamp-1">
                    {creator.popular_work_title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
