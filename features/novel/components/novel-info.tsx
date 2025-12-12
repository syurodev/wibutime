/**
 * Novel Info Sidebar - Server Component
 * Displays synopsis and novel metadata
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { NovelFullResponse } from "@/features/novel/types";
import { Calendar, FileText, Languages, User } from "lucide-react";

interface NovelInfoProps {
  novel: NovelFullResponse;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatWords(words: number): string {
  if (words >= 1000000) return `${(words / 1000000).toFixed(1)}M từ`;
  if (words >= 1000) return `${(words / 1000).toFixed(1)}K từ`;
  return `${words} từ`;
}

/**
 * Render synopsis content (JSON or string)
 */
function SynopsisContent({ synopsis }: { synopsis: unknown }) {
  if (!synopsis) {
    return <p className="text-muted-foreground">Chưa có mô tả</p>;
  }

  // If it's a string, render directly
  if (typeof synopsis === "string") {
    return (
      <p className="text-sm leading-relaxed whitespace-pre-line">{synopsis}</p>
    );
  }

  // If it's an object (PlateJS content), try to extract text
  if (
    typeof synopsis === "object" &&
    "blocks" in (synopsis as Record<string, unknown>)
  ) {
    const blocks = (
      synopsis as { blocks: Array<{ children?: Array<{ text?: string }> }> }
    ).blocks;
    const text = blocks
      ?.map((block) =>
        block.children?.map((child) => child.text || "").join("")
      )
      .join("\n");
    return (
      <p className="text-sm leading-relaxed whitespace-pre-line">
        {text || "Chưa có mô tả"}
      </p>
    );
  }

  // Fallback: try to stringify
  try {
    const parsed =
      typeof synopsis === "string" ? JSON.parse(synopsis) : synopsis;
    if (Array.isArray(parsed)) {
      const text = parsed
        .map((block: { children?: Array<{ text?: string }> }) =>
          block.children?.map((child) => child.text || "").join("")
        )
        .join("\n");
      return (
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {text || "Chưa có mô tả"}
        </p>
      );
    }
  } catch {
    // Ignore parse errors
  }

  return <p className="text-muted-foreground">Chưa có mô tả</p>;
}

export function NovelInfo({ novel }: NovelInfoProps) {
  return (
    <div className="space-y-6">
      {/* Synopsis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Giới thiệu</CardTitle>
        </CardHeader>
        <CardContent>
          <SynopsisContent synopsis={novel.synopsis} />
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authors */}
          {novel.authors.length > 0 && (
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tác giả</p>
                <p className="text-sm font-medium">
                  {novel.authors.map((a) => a.display_name).join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Artists */}
          {novel.artists.length > 0 && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Họa sĩ</p>
                  <p className="text-sm font-medium">
                    {novel.artists.map((a) => a.display_name).join(", ")}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Stats */}
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nội dung</p>
              <p className="text-sm">
                {novel.total_volumes > 0 && `${novel.total_volumes} tập • `}
                {novel.total_chapters} chương • {formatWords(novel.total_words)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Language */}
          {novel.original_language && (
            <>
              <div className="flex items-start gap-3">
                <Languages className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngôn ngữ gốc</p>
                  <p className="text-sm font-medium">
                    {novel.original_language.toUpperCase()}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Dates */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-1 text-sm">
              {novel.first_published_at && (
                <p>
                  <span className="text-muted-foreground">Xuất bản: </span>
                  {formatDate(novel.first_published_at)}
                </p>
              )}
              {novel.last_chapter_at && (
                <p>
                  <span className="text-muted-foreground">Cập nhật: </span>
                  {formatDate(novel.last_chapter_at)}
                </p>
              )}
              {novel.completed_at && (
                <p>
                  <span className="text-muted-foreground">Hoàn thành: </span>
                  {formatDate(novel.completed_at)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
