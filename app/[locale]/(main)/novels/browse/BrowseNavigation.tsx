/**
 * Browse Navigation
 * Client component for pagination
 */

"use client";

import { useNav } from "@/components/layout/nav/useNav";
import { Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface BrowseNavigationProps {
  readonly currentPage: number;
  readonly totalPages: number;
}

export function BrowseNavigation({
  currentPage,
  totalPages,
}: BrowseNavigationProps) {
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
        id: "browse-pagination",
        type: "pagination",
        icon: <Clock className="h-5 w-5" />,
        label: "Page",
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
      },
    ]);
  }, [currentPage, totalPages, searchParams, setNavItems]);

  return null;
}
