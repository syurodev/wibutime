/**
 * New Series Section Component
 * Displays recently added series in a grid layout
 */

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContentCard } from "@/components/content/ContentCard";
import { Container } from "@/components/layout/Container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { MediaSeries } from "@/lib/api/models/content/base-content";

export interface NewSeriesSectionProps {
	readonly series: MediaSeries[];
}

export async function NewSeriesSection({ series }: NewSeriesSectionProps) {
	const t = await getTranslations("home");

	if (!series || series.length === 0) {
		return null;
	}

	return (
		<section className="w-full py-12">
			<Container maxWidth="xl">
				{/* Section Header */}
				<div className="mb-8 flex items-end justify-between">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							{t("newSeries.title")}
						</h2>
						<p className="text-muted-foreground">{t("newSeries.subtitle")}</p>
					</div>

					{/* See All Link */}
					<Button variant="ghost" className="group gap-2" asChild>
						<Link href="/new">
							{t("common.seeAll")}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
				</div>

				{/* Grid Layout */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
					{series.map((item) => (
						<AspectRatio key={item.id} ratio={3 / 5} className="w-full">
							<ContentCard series={item} className="h-full" />
						</AspectRatio>
					))}
				</div>
			</Container>
		</section>
	);
}
