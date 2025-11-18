/**
 * Library Page - User's personal collection
 * Displays saved anime, manga, and novels with filters and stats
 */

import { Container } from "@/components/layout/Container";
import { LibraryEmpty } from "@/components/library/LibraryEmpty";
import { LibraryContent } from "@/components/library/LibraryContent";
import { LibraryStats } from "@/components/library/LibraryStats";
import { getCachedTrending } from "@/lib/api/services/base-content/content.cached";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Page metadata (SEO)
 */
export const metadata: Metadata = {
	title: "My Library - WibuTime",
	description:
		"Your personal collection of anime, manga, and novels on WibuTime",
	keywords: ["library", "collection", "saved", "bookmarks", "wibutime"],
};

/**
 * Library Page Server Component
 */
export default async function LibraryPage() {
	const t = await getTranslations("library");

	// TODO: Replace with actual user library data from API
	// For now, we'll use trending data as demo content
	const userLibrary = await getCachedTrending(20);

	// TODO: Replace with actual user stats from API
	const userStats = {
		total: userLibrary.length,
		reading: Math.floor(userLibrary.length * 0.4),
		completed: Math.floor(userLibrary.length * 0.3),
		planToRead: Math.floor(userLibrary.length * 0.3),
	};

	const hasContent = userLibrary && userLibrary.length > 0;

	return (
		<div className="min-h-screen pb-24">
			<Container maxWidth="xl">
				{/* Page Header */}
				<div className="py-8 md:py-12">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
							{t("title")}
						</h1>
						<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
					</div>
				</div>

				{/* Stats Section */}
				{hasContent && (
					<div className="mb-8">
						<LibraryStats stats={userStats} />
					</div>
				)}

				{/* Content Section */}
				{hasContent ? (
					<LibraryContent series={userLibrary} />
				) : (
					<LibraryEmpty />
				)}
			</Container>
		</div>
	);
}
