"use client";

import {
	Book,
	ChevronRight,
	Eye,
	List,
	Lock,
	MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";

interface NovelTabsProps {
	novel: any; // Bạn nên thay 'any' bằng Interface chuẩn của bạn (e.g., MediaSeries)
}

export function NovelTabs({ novel }: NovelTabsProps) {
	const totalChaptersCount = novel.volumes.reduce(
		(acc: number, vol: any) => acc + vol.totalChapters,
		0,
	);

	return (
		<Tabs defaultValue="chapters" className="w-full">
			{/* --- CUSTOM STYLE TABS LIST (UNDERLINE STYLE) --- */}
			<TabsList>
				<TabsTrigger value="about">Giới Thiệu</TabsTrigger>
				<TabsTrigger value="chapters">
					Danh Sách Chương
					<Badge
						variant="secondary"
						className="ml-2 text-xs h-5 px-1.5 bg-muted text-foreground"
					>
						{totalChaptersCount}
					</Badge>
				</TabsTrigger>
				<TabsTrigger value="comments">Bình Luận</TabsTrigger>
			</TabsList>

			{/* --- TAB CONTENT 1: ABOUT --- */}
			<TabsContent
				value="about"
				className="mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
			>
				<div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
					<div dangerouslySetInnerHTML={{ __html: novel.description }} />
				</div>
				<div className="bg-card border rounded-xl p-5">
					<h3 className="text-base font-semibold mb-3 flex items-center gap-2">
						<List className="size-4 text-primary" /> Tags
					</h3>
					<div className="flex flex-wrap gap-2">
						{novel.tags.map((tag: string) => (
							<Badge
								key={tag}
								variant="secondary"
								className="px-3 py-1.5 text-sm cursor-pointer font-normal hover:bg-primary/10 transition-colors"
							>
								#{tag}
							</Badge>
						))}
					</div>
				</div>
			</TabsContent>

			{/* --- TAB CONTENT 2: CHAPTERS (ACCORDION) --- */}
			<TabsContent
				value="chapters"
				className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
			>
				<div className="flex justify-between items-center px-1">
					<span className="text-sm text-muted-foreground font-medium">
						Tổng số: {novel.volumes.length} Tập
					</span>
					<Button
						variant="ghost"
						size="sm"
						className="text-primary h-8 text-xs"
					>
						Mới nhất trước
					</Button>
				</div>

				<Accordion
					type="multiple"
					className="w-full space-y-4"
					defaultValue={[novel.volumes[0].id]}
				>
					{novel.volumes.map((vol: any) => (
						<AccordionItem
							key={vol.id}
							value={vol.id}
							className="border rounded-xl bg-card px-0 shadow-sm overflow-hidden data-[state=open]:border-primary/40 transition-colors"
						>
							{/* Volume Header */}
							<AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/30 data-[state=open]:bg-muted/50">
								<div className="flex items-center gap-3 text-left flex-1">
									<div className="flex items-center justify-center size-8 rounded-lg bg-background border shadow-sm text-foreground shrink-0">
										<Book className="size-4" />
									</div>
									<div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 flex-1">
										<span className="font-bold text-sm md:text-base">
											{vol.title}
										</span>
										<Badge
											variant="outline"
											className="w-fit text-[10px] h-5 font-normal text-muted-foreground bg-background"
										>
											{vol.totalChapters} chương
										</Badge>
									</div>
								</div>
							</AccordionTrigger>

							{/* Chapter Grid */}
							<AccordionContent className="pb-0">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 p-3">
									{vol.chapters.map((chapter: any) => (
										<Link
											href={`/read/${novel.slug}/${chapter.id}`}
											key={chapter.id}
											className="group"
										>
											<div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent cursor-pointer transition-all border border-transparent hover:border-border/50">
												<div className="flex flex-col overflow-hidden pr-2 gap-1">
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
															{chapter.title}
														</span>
														{!chapter.isFree && (
															<Lock className="size-3 text-yellow-500 shrink-0" />
														)}
													</div>
													<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
														<span>{chapter.createdAt}</span>
														<span className="hidden sm:inline">•</span>
														<span className="hidden sm:flex items-center gap-0.5">
															<Eye className="size-3" />{" "}
															{formatNumberAbbreviated(chapter.views)}
														</span>
													</div>
												</div>
												<ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
											</div>
										</Link>
									))}
									<div className="col-span-1 md:col-span-2 mt-2">
										<Button
											variant="ghost"
											size="sm"
											className="w-full text-xs text-muted-foreground h-8 border border-dashed hover:bg-accent"
										>
											Xem toàn bộ {vol.totalChapters} chương
										</Button>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</TabsContent>

			{/* --- TAB CONTENT 3: COMMENTS --- */}
			<TabsContent value="comments" className="mt-6">
				<Card className="flex flex-col items-center justify-center py-16 text-center border-dashed bg-muted/20">
					<div className="bg-muted rounded-full p-4 mb-4">
						<MessageSquare className="size-6 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold">Bình luận</h3>
					<p className="text-sm text-muted-foreground max-w-xs mt-2">
						Tính năng bình luận đang được xây dựng. Hãy quay lại sau nhé!
					</p>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
