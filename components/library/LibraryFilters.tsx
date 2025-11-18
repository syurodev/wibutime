/**
 * Library Filters Component
 * Filter controls for library content with URL state sync
 */

"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import { ArrowDownAZ } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export type SortOption = "recent" | "title" | "updated" | "rating";

export interface LibraryFiltersProps {
	readonly currentType: CONTENT_TYPE | "all";
	readonly currentSort: SortOption;
}

export function LibraryFilters({
	currentType,
	currentSort,
}: LibraryFiltersProps) {
	const t = useTranslations("library");
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
		router.push(queryString ? `?${queryString}` : window.location.pathname);
	};

	const handleSortChange = (newSort: string) => {
		const params = new URLSearchParams(searchParams.toString());

		// Set the new sort
		if (newSort === "recent") {
			params.delete("sort");
		} else {
			params.set("sort", newSort);
		}

		// Reset to page 1 when changing sort
		params.delete("page");

		// Update URL
		const queryString = params.toString();
		router.push(queryString ? `?${queryString}` : window.location.pathname);
	};

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			{/* Type Tabs */}
			<Tabs
				value={currentType}
				onValueChange={handleTypeChange}
				className="w-full md:w-auto"
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
					<TabsTrigger value="anime">{t("tabs.anime")}</TabsTrigger>
					<TabsTrigger value="manga">{t("tabs.manga")}</TabsTrigger>
					<TabsTrigger value="novel">{t("tabs.novel")}</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Sort Select */}
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<ArrowDownAZ className="h-4 w-4" />
					<span className="hidden sm:inline">{t("filters.sort")}</span>
				</div>
				<Select value={currentSort} onValueChange={handleSortChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="recent">{t("sortOptions.recent")}</SelectItem>
						<SelectItem value="title">{t("sortOptions.title")}</SelectItem>
						<SelectItem value="updated">
							{t("sortOptions.updated")}
						</SelectItem>
						<SelectItem value="rating">{t("sortOptions.rating")}</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
