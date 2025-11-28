/**
 * Workspace Novel Volumes Page
 * Quản lý volumes của novel trong workspace
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, FileEdit, Trash2, BookText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{
    tenantId: string;
    novelId: string;
  }>;
}

export default async function NovelVolumesPage({ params }: Props) {
  const { tenantId, novelId } = await params;

  // TODO: Fetch novel and volumes from API
  const novel = {
    id: novelId,
    title: "Sample Novel",
    total_volumes: 0,
  };

  const volumes: any[] = [];

  return (
    <Container maxWidth="2xl" className=" py-8 space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/workspace/${tenantId}/novels`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Novels
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{novel.title}</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý volumes và chapters
            </p>
          </div>
          <Button asChild>
            <Link href={`/workspace/${tenantId}/novels/${novelId}/volumes/create`}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Volume mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/workspace/${tenantId}/novels/${novelId}/chapters/create`}>
            <BookText className="h-4 w-4 mr-2" />
            Viết Chapter mới
          </Link>
        </Button>
      </div>

      {/* Volumes List */}
      {volumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có volume nào</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Tạo volume đầu tiên để tổ chức chapters
            </p>
            <Button asChild>
              <Link href={`/workspace/${tenantId}/novels/${novelId}/volumes/create`}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Volume đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {volumes.map((volume) => (
            <Card key={volume.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        Volume {volume.volume_number}: {volume.title}
                      </CardTitle>
                      <Badge variant={volume.is_published ? "default" : "secondary"}>
                        {volume.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {volume.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {volume.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{volume.chapter_count} chapters</span>
                    <span>{volume.word_count} words</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/workspace/${tenantId}/novels/${novelId}/volumes/${volume.id}/chapters`}>
                        <BookText className="h-4 w-4 mr-2" />
                        Chapters
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/workspace/${tenantId}/novels/${novelId}/volumes/${volume.id}/edit`}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Sửa
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
