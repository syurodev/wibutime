/**
 * Dashboard Novels List Page
 * Danh sách novels cá nhân
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, FileEdit, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Container } from "@/components/layout/Container";

export default function DashboardNovelsPage() {
  // TODO: Fetch real novels from API with owner_type='user'
  const novels: any[] = [];

  return (
    <Container maxWidth="2xl" className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Novels của tôi</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý novels cá nhân (owner: bạn)
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/novels/create">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Novel mới
          </Link>
        </Button>
      </div>

      {/* Novels List */}
      {novels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Chưa có novel nào
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Bắt đầu hành trình sáng tạo của bạn bằng cách tạo novel đầu tiên
            </p>
            <Button asChild>
              <Link href="/dashboard/novels/create">
                <Plus className="h-4 w-4 mr-2" />
                Tạo Novel đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {novels.map((novel) => (
            <Card key={novel.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{novel.title}</CardTitle>
                      <Badge variant={novel.status === "published" ? "default" : "secondary"}>
                        {novel.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {novel.synopsis}
                    </p>
                  </div>
                  {novel.cover_image_url && (
                    <img
                      src={novel.cover_image_url}
                      alt={novel.title}
                      className="w-20 h-28 object-cover rounded ml-4"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{novel.total_volumes} volumes</span>
                    <span>{novel.total_chapters} chapters</span>
                    <span>{novel.view_count} views</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/novels/${novel.id}/volumes`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Volumes
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/novels/${novel.id}/edit`}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
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
