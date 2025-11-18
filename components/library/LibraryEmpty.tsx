/**
 * Library Empty State Component
 * Shown when user's library is empty
 */

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Library, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function LibraryEmpty() {
	const t = useTranslations("library");

	return (
		<div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/30 p-12 text-center">
			<div className="mb-6 rounded-full bg-muted p-6">
				<Library className="h-12 w-12 text-muted-foreground" />
			</div>

			<h3 className="mb-2 text-2xl font-bold tracking-tight">{t("empty")}</h3>
			<p className="mb-8 max-w-md text-muted-foreground">
				{t("emptyDescription")}
			</p>

			<div className="flex gap-3">
				<Button asChild size="lg">
					<Link href="/trending">
						<TrendingUp className="mr-2 h-5 w-5" />
						Explore Trending
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link href="/">Browse All</Link>
				</Button>
			</div>
		</div>
	);
}
