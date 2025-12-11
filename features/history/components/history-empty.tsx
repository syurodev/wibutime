/**
 * History Empty State Component
 * Shown when user has no viewing history
 */

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Clock, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function HistoryEmpty() {
	const t = useTranslations("history");

	return (
		<div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/30 p-12 text-center">
			<div className="mb-6 rounded-full bg-muted p-6">
				<Clock className="h-12 w-12 text-muted-foreground" />
			</div>

			<h3 className="mb-2 text-2xl font-bold tracking-tight">{t("empty")}</h3>
			<p className="mb-8 max-w-md text-muted-foreground">
				{t("emptyDescription")}
			</p>

			<div className="flex gap-3">
				<Button asChild size="lg">
					<Link href="/trending">
						<TrendingUp className="mr-2 h-5 w-5" />
						{t("exploreTrending")}
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link href="/">{t("browseAll")}</Link>
				</Button>
			</div>
		</div>
	);
}
