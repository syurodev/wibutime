/**
 * Dashboard Novel Volumes Page
 * Quản lý volumes của novel
 */

import { DraggableVolumeList } from "@/components/dashboard/novels/draggable-volume-list";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NovelVolumeService } from "@/features/novel-volume/service";
import { Link } from "@/i18n/routing";
import { AlertCircle, ArrowLeft, BookText, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default async function NovelVolumesPage({ params }: Props) {
  const { novelId } = await params;
  const t = await getTranslations("dashboard.volumes");

  // Fetch novel info and volumes from API
  let novelTitle = t("title");
  let volumes: any[] = [];
  let error: string | null = null;

  try {
    // Fetch volumes
    const data = await NovelVolumeService.getByNovel(novelId);

    // Parse new response structure
    if (data) {
      novelTitle = data.novel_title || novelTitle;
      volumes = data.volumes || [];
    }
  } catch (err: any) {
    console.error("Failed to fetch volumes:", err);
    error = err.message || t("error.title");
  }

  return (
    <Container maxWidth="2xl" className="py-8 space-y-6">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/novels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToNovels")}
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-3xl font-bold">{novelTitle}</h1>
              <p className="text-muted-foreground mt-1">
                {t("countSubtitle", { count: volumes.length })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/dashboard/novels/${novelId}/chapters/create`}>
                <BookText className="h-4 w-4 mr-2" />
                {t("writeChapter")}
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/novels/${novelId}/volumes/create`}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createNew")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("error.title")}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {error}
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/novels">{t("error.backToList")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!error && volumes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("empty.title")}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {t("empty.description")}
            </p>
            <Button asChild>
              <Link href={`/dashboard/novels/${novelId}/volumes/create`}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createFirst")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Volumes List */}
      {!error && volumes.length > 0 && (
        <DraggableVolumeList initialVolumes={volumes} novelId={novelId} />
      )}
    </Container>
  );
}
