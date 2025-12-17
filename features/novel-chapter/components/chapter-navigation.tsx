"use client";

import { useNav } from "@/components/layout/nav/use-nav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { NovelFullResponse } from "@/features/novel/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { List, MessageSquare, Send, Type } from "lucide-react";
import { useEffect, useState } from "react";

interface ChapterNavigationProps {
  readonly novel: NovelFullResponse;
  readonly currentChapterId: string;
}

export function ChapterNavigation({
  novel,
  currentChapterId,
}: ChapterNavigationProps) {
  const { setNavItems, toggleSettingsMenu } = useNav();
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    // TODO: Implement comment submission logic
    console.log("Submitting comment:", commentText);
    setCommentText("");
  };

  useEffect(() => {
    setNavItems([
      {
        id: "settings",
        type: "trigger",
        icon: <Type className="h-5 w-5" />,
        label: "Giao diện",
        onClick: toggleSettingsMenu,
      },
    ]);
  }, [setNavItems, toggleSettingsMenu]);

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsChapterListOpen(true)}
          title="Danh sách chương"
        >
          <List className="h-5 w-5" />
          <span className="sr-only">Danh sách chương</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCommentOpen(true)}
          title="Bình luận"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Bình luận</span>
        </Button>
      </div>

      <Sheet open={isChapterListOpen} onOpenChange={setIsChapterListOpen}>
        <SheetContent side="right" className="w-[90%] max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Mục lục</SheetTitle>
            <SheetDescription className="truncate">
              {novel.title}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] px-4">
            <div className="space-y-6">
              {novel.volumes.map((volume) => (
                <div key={volume.id} className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground/80 sticky top-0 bg-background py-2">
                    {volume.title}
                  </h3>
                  <div className="space-y-1">
                    {volume.chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={`/novels/${novel.slug}/chapters/${chapter.slug}`}
                        onClick={() => setIsChapterListOpen(false)}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                          chapter.id === currentChapterId
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="mr-2">
                          Chương {chapter.chapter_number}:
                        </span>
                        {chapter.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Loose chapters */}
              {novel.chapters.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground/80 sticky top-0 bg-background py-2">
                    Chương khác
                  </h3>
                  <div className="space-y-1">
                    {novel.chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={`/novels/${novel.slug}/chapters/${chapter.slug}`}
                        onClick={() => setIsChapterListOpen(false)}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                          chapter.id === currentChapterId
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="mr-2">
                          Chương {chapter.chapter_number}:
                        </span>
                        {chapter.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Sheet open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <SheetContent side="right" className="w-[90%] max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Bình luận</SheetTitle>
            <SheetDescription>
              Tính năng bình luận đang được phát triển.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full mt-4 gap-4">
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
              <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">Chưa có bình luận nào.</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  placeholder="Viết bình luận của bạn..."
                  className="resize-none min-h-[100px] pr-12 pb-10"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 transition-opacity"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Gửi bình luận</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
