"use client";

import { Link } from "@/i18n/routing";
import { MediaSeries } from "@/lib/api/models/content/base-content";
import { getImageUrl } from "@/lib/utils/get-image-url";
import {
  BookOpen,
  FileEdit,
  LayoutGrid,
  LayoutList,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MEDIA_STATUS } from "@/lib/constants/default";
import { formatFullDate } from "@/lib/utils/date-ranges";
import { getInitials } from "@/lib/utils/get-initials";
import { AvatarImage } from "@radix-ui/react-avatar";

interface NovelListProps {
  readonly novels: MediaSeries[];
}

export function NovelList({ novels }: NovelListProps) {
  const [view, setView] = useState<"grid" | "table">("table");

  console.log(novels);

  return (
    <div className="space-y-8">
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
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("table")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          <Button asChild>
            <Link href="/dashboard/novels/create">
              <Plus className="h-4 w-4 mr-2" />
              Tạo Novel mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {novels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có novel nào</h3>
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
        <>
          {/* Grid View */}
          {view === "grid" && (
            <div className="grid gap-4">
              {novels.map((novel) => (
                <Card key={novel.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">
                            {novel.title}
                          </CardTitle>
                          <Badge
                            variant={
                              novel.status === "ongoing" ||
                              novel.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {novel.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {novel.synopsis && novel.synopsis.length > 0
                            ? "Có mô tả"
                            : "Chưa có mô tả"}
                        </p>
                      </div>
                      {novel.cover_url && (
                        <img
                          src={getImageUrl(novel.cover_url)}
                          alt={novel.title}
                          className="w-20 h-28 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{novel.views} views</span>
                        <span>{novel.favorites} favorites</span>
                        <span>{novel.rating} rating</span>
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

          {/* Table View */}
          {view === "table" && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">Cover</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {novels.map((novel) => (
                    <TableRow key={novel.id}>
                      <TableCell>
                        {/* Cover */}
                        <Avatar className="w-[66px] h-[100px] rounded-lg border-3">
                          <AvatarImage src={getImageUrl(novel.cover_url)} />
                          <AvatarFallback className="w-[66px] h-[100px] rounded-lg font-semibold text-xl">
                            {getInitials(novel.title)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium line-clamp-1">
                          {novel.title}
                        </div>
                        {novel.original_title && (
                          <div className="text-sm text-muted-foreground">
                            {novel.original_title}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatFullDate(novel.updated_at)}
                        </p>

                        <Badge className="uppercase mt-1" variant={"outline"}>
                          {novel.original_language}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            novel.status === MEDIA_STATUS.ONGOING ||
                            novel.status === MEDIA_STATUS.COMPLETED
                              ? "default"
                              : "secondary"
                          }
                        >
                          {novel.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>{novel.views} views</div>
                          <div>{novel.favorites} favorites</div>
                          <div>{novel.rating} rating</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link
                              href={`/dashboard/novels/${novel.id}/volumes`}
                            >
                              <BookOpen className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/dashboard/novels/${novel.id}/edit`}>
                              <FileEdit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
