import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.wibutime.io.vn",
      },
    ],
  },
  cacheComponents: true,
  experimental: {
    viewTransition: true,
    taint: true,
    authInterrupts: true,
  },
  // Custom cache profiles for different content types
  cacheLife: {
    // Featured content (hero carousel) - updates less frequently
    featured: {
      stale: 60 * 5, // 5 minutes - client can use cached version
      revalidate: 60 * 15, // 15 minutes - background refresh
      expire: 60 * 60, // 1 hour - must regenerate after this
    },
    // Trending content - updates based on views, moderately frequent
    trending: {
      stale: 60 * 5, // 5 minutes
      revalidate: 60 * 10, // 10 minutes
      expire: 60 * 60, // 1 hour
    },
    // Latest updates - should be relatively fresh
    latest: {
      stale: 60 * 3, // 3 minutes
      revalidate: 60 * 5, // 5 minutes
      expire: 60 * 30, // 30 minutes
    },
    // New series - doesn't change as often
    newSeries: {
      stale: 60 * 10, // 10 minutes
      revalidate: 60 * 30, // 30 minutes
      expire: 60 * 60 * 2, // 2 hours
    },
    history: {
      stale: 60 * 10, // 10 minutes
      revalidate: 60 * 30, // 30 minutes
      expire: 60 * 60 * 2, // 2 hours
    },
    // Moderate caching for community features (creators, milestones)
    moderate: {
      stale: 60 * 10, // 10 minutes
      revalidate: 60 * 30, // 30 minutes
      expire: 60 * 60 * 2, // 2 hours
    },
    // Long caching for slowly changing data (genres, stats)
    long: {
      stale: 60 * 15, // 15 minutes
      revalidate: 60 * 60, // 1 hour
      expire: 60 * 60 * 4, // 4 hours
    },
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
