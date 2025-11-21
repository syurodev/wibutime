/**
 * Library Stats Component
 * Displays user's library statistics
 */

import { BookOpen, CheckCircle2, Clock, Library } from "lucide-react";
import { useTranslations } from "next-intl";

export interface LibraryStatsData {
	total: number;
	reading: number;
	completed: number;
	planToRead: number;
}

export interface LibraryStatsProps {
	readonly stats: LibraryStatsData;
}

export function LibraryStats({ stats }: LibraryStatsProps) {
	const t = useTranslations("library.stats");

	const statItems = [
		{
			label: t("total"),
			value: stats.total,
			icon: Library,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-950",
		},
		{
			label: t("reading"),
			value: stats.reading,
			icon: BookOpen,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-950",
		},
		{
			label: t("completed"),
			value: stats.completed,
			icon: CheckCircle2,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-950",
		},
		{
			label: t("planToRead"),
			value: stats.planToRead,
			icon: Clock,
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-950",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
			{statItems.map((item) => {
				const Icon = item.icon;
				return (
					<div
						key={item.label}
						className={`rounded-2xl border p-4 transition-all hover:shadow-md ${item.bgColor}`}
					>
						<div className="flex items-start justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									{item.label}
								</p>
								<p className="text-2xl font-bold tracking-tight">{item.value}</p>
							</div>
							<div className={`rounded-lg p-2 ${item.color} ${item.bgColor}`}>
								<Icon className="h-5 w-5" />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
