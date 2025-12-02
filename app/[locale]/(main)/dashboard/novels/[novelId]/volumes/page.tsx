/**
 * Dashboard Novel Volumes Page
 * Quản lý volumes của novel
 */

import { DraggableVolumeList } from "@/components/dashboard/novels/draggable-volume-list";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getVolumesByNovel } from "@/lib/api/volumes";
import { AlertCircle, ArrowLeft, BookText, Plus } from "lucide-react";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default async function NovelVolumesPage({ params }: Props) {
  const { novelId } = await params;

  // Fetch novel info and volumes from API
  let novelTitle = "Quản lý Volumes";
  let volumes: any[] = [];
  let error: string | null = null;

  try {
    // Fetch volumes
    const volumesResponse = await getVolumesByNovel(novelId);

    console.log(volumesResponse);

    // Parse new response structure
    if (volumesResponse.data) {
      novelTitle = volumesResponse.data.novel_title || novelTitle;
      volumes = volumesResponse.data.volumes || [];
    }
  } catch (err: any) {
    console.error("Failed to fetch volumes:", err);
    error = err.message || "Không thể tải danh sách volumes";
  }

  return (
    <Container maxWidth="2xl" className=" py-8 space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/novels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Novels
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{novelTitle}</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý volumes và chapters
            </p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/novels/${novelId}/volumes/create`}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Volume mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/dashboard/novels/${novelId}/chapters/create`}>
            <BookText className="h-4 w-4 mr-2" />
            Viết Chapter mới
          </Link>
        </Button>
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
              <Link href="/dashboard/novels">Quay lại danh sách novels</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Volumes List */}
      {!error && volumes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có volume nào</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Tạo volume đầu tiên để tổ chức chapters của bạn
            </p>
            <Button asChild>
              <Link href={`/dashboard/novels/${novelId}/volumes/create`}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Volume đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && volumes.length > 0 && (
        <DraggableVolumeList initialVolumes={volumes} novelId={novelId} />
      )}
    </Container>
  );
}
