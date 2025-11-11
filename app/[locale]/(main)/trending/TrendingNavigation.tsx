/**
 * Trending Page Navigation
 * Client component that configures bottom navigation with pagination
 */

"use client";

import { useNav } from "@/components/layout/nav/useNav";
import { Flame } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface TrendingNavigationProps {
  readonly currentPage: number;
  readonly totalPages: number;
}

export function TrendingNavigation({
  currentPage,
  totalPages,
}: TrendingNavigationProps) {
  const { setNavItems } = useNav();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  // Configure navigation items
  useEffect(() => {
    setNavItems([
      {
        id: "trending-pagination",
        type: "pagination",
        icon: <Flame className="h-5 w-5" />,
        label: "Page",
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
      },
    ]);
  }, [currentPage, totalPages, searchParams]);

  return null;
}
