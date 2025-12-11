/**
 * Content Type Tabs Component
 * Filter tabs for content types with URL state sync
 */

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MEDIA_TYPE } from "@/lib/constants/default";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export interface MediaTypeTabsProps {
  readonly currentType?: MEDIA_TYPE | "all";
  readonly className?: string;
}

export function MediaTypeTabs({
  currentType = "all",
  className,
}: MediaTypeTabsProps) {
  const t = useTranslations("home.popular.tabs");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set the new type
    if (newType === "all") {
      params.delete("type");
    } else {
      params.set("type", newType);
    }

    // Reset to page 1 when changing type
    params.delete("page");

    // Update URL
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : globalThis.location.pathname);
  };

  return (
    <Tabs
      value={currentType}
      onValueChange={handleTypeChange}
      className={className}
    >
      <TabsList>
        <TabsTrigger value="all">{t("all")}</TabsTrigger>
        <TabsTrigger value="anime">{t("anime")}</TabsTrigger>
        <TabsTrigger value="manga">{t("manga")}</TabsTrigger>
        <TabsTrigger value="novel">{t("novel")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
