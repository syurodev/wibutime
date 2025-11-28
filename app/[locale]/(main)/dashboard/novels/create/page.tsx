/**
 * Dashboard Create Novel Page
 * Form tạo novel mới (owner_type = 'user')
 */

"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNovelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get("title"),
        original_language: formData.get("original_language"),
        synopsis: formData.get("synopsis"),
        owner_type: "user", // Auto set to 'user' for personal dashboard
        // owner_id will be set to current user ID by API
      };

      // TODO: Call API to create novel
      console.log("Creating novel:", data);

      toast.success("Novel đã được tạo thành công!");
      router.push("/dashboard/novels");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo novel");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="2xl" className=" py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard/novels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Tạo Novel mới</h1>
        <p className="text-muted-foreground mt-1">
          Tạo novel cá nhân (Chủ sở hữu: Bạn)
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề novel..."
                required
              />
            </div>

            {/* Original Language */}
            <div className="space-y-2">
              <Label htmlFor="original_language">
                Ngôn ngữ gốc <span className="text-destructive">*</span>
              </Label>
              <Select name="original_language" defaultValue="vi" required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                  <SelectItem value="ko">한국어 (Korean)</SelectItem>
                  <SelectItem value="zh">中文 (Chinese)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <Label htmlFor="synopsis">Tóm tắt</Label>
              <Textarea
                id="synopsis"
                name="synopsis"
                placeholder="Nhập tóm tắt nội dung..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Tóm tắt ngắn gọn về nội dung novel
              </p>
            </div>

            {/* Owner Info */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">Chủ sở hữu:</p>
                <span className="text-sm text-muted-foreground">
                  Bạn (Personal)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Novel này sẽ được tạo dưới quyền sở hữu cá nhân của bạn
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/novels">Hủy</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Đang tạo..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Tạo Novel
              </>
            )}
          </Button>
        </div>
      </form>
    </Container>
  );
}
