import { HomeDataProvider } from "@/features/home/components/HomeDataProvider";
import { getHomeData } from "@/features/home/queries";
import type { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
  trending: ReactNode;
  genre_hub: ReactNode;
  community: ReactNode;
  latest: ReactNode;
  newSeries: ReactNode;
  milestones: ReactNode;
  continue: ReactNode;
}

export default async function HomeLayout({
  children,
  trending,
  genre_hub,
  community,
  latest,
  newSeries,
  milestones,
  continue: continueReading,
}: HomeLayoutProps) {
  // Fetch all home data in one API call (cached by backend for 10 min)
  const homeDataPromise = getHomeData();

  return (
    <HomeDataProvider homeDataPromise={homeDataPromise}>
      <div className="min-h-screen pb-24">
        {/* Hero Section - from page.tsx */}
        {children}

        {/* Continue Reading */}
        {continueReading}

        {/* Trending Content */}
        {trending}

        {/* Genre Hub */}
        {genre_hub}

        {/* Community Engagement */}
        {community}

        {/* Latest Updates */}
        {latest}

        {/* New Series */}
        {newSeries}

        {/* Community Milestones */}
        {milestones}
      </div>
    </HomeDataProvider>
  );
}
