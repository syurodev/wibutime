/**
 * Dashboard Chapter List Page
 * Quản lý chapters của volume
 */

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChapterService } from "@/features/novel-chapter/service";
import { Link } from "@/i18n/routing";
import {
  AlertCircle,
  ArrowLeft,
  BookText,
  Eye,
  FileEdit,
  Plus,
  Trash2,
} from "lucide-react";

interface Props {
  params: Promise<{
    novelId: string;
    volumeId: string;
  }>;
}

export default async function VolumeChaptersPage({ params }: Props) {
  const { novelId, volumeId } = await params;

  // Fetch chapters from API
  let volumeTitle = "Quản lý Chapters";
  let chapters: any[] = [];
  let error: string | null = null;

  try {
    const data = await ChapterService.getByVolume(volumeId);

    if (data) {
      volumeTitle = data.volume_title || volumeTitle;
      chapters = data.chapters || [];
    }
  } catch (err: any) {
    console.error("Failed to fetch chapters:", err);
    error = err.message || "Không thể tải danh sách chapters";
  }

  return (
    <Container maxWidth="2xl" className="py-8 space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/dashboard/novels/${novelId}/volumes`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Volumes
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{volumeTitle}</h1>
            <p className="text-muted-foreground mt-1">Danh sách chapters</p>
          </div>
          <Button asChild>
            <Link
              href={`/dashboard/novels/${novelId}/volumes/${volumeId}/chapters/create`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo Chapter mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {error}
            </p>
            <Button asChild variant="outline">
              <Link href={`/dashboard/novels/${novelId}/volumes`}>
                Quay lại danh sách volumes
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chapters List */}
      {!error && chapters.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có chapter nào</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Hãy bắt đầu viết chapter đầu tiên cho volume này.
            </p>
            <Button asChild>
              <Link
                href={`/dashboard/novels/${novelId}/volumes/${volumeId}/chapters/create`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo Chapter đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && chapters.length > 0 && (
        <div className="grid gap-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">
                        Chương {chapter.chapter_number}: {chapter.title}
                      </CardTitle>
                      <Badge
                        variant={
                          chapter.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {chapter.status}
                      </Badge>
                      {chapter.is_free && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Free
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {chapter.view_count} views
                      </span>
                      <span>{chapter.word_count?.toLocaleString()} words</span>
                      <span>
                        {new Date(chapter.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/dashboard/novels/${novelId}/volumes/${volumeId}/chapters/${chapter.id}/edit`}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
