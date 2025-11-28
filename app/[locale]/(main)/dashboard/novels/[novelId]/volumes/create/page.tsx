/**
 * Dashboard Create Volume Page
 * Form tạo volume mới cho novel
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default function CreateVolumePage({ params }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novelId, setNovelId] = useState<string>("");

  // Unwrap params
  useState(() => {
    params.then((p) => setNovelId(p.novelId));
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        novel_id: novelId,
        volume_number: formData.get("volume_number"),
        title: formData.get("title"),
        description: formData.get("description"),
      };

      // TODO: Call API to create volume
      console.log("Creating volume:", data);

      toast.success("Volume đã được tạo thành công!");
      router.push(`/dashboard/novels/${novelId}/volumes`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo volume");
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
          <Link href={`/dashboard/novels/${novelId}/volumes`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Tạo Volume mới</h1>
        <p className="text-muted-foreground mt-1">
          Thêm volume mới cho novel
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Volume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Volume Number */}
            <div className="space-y-2">
              <Label htmlFor="volume_number">
                Số thứ tự Volume <span className="text-destructive">*</span>
              </Label>
              <Input
                id="volume_number"
                name="volume_number"
                type="number"
                min="1"
                placeholder="1"
                required
              />
              <p className="text-xs text-muted-foreground">
                Số thứ tự của volume (VD: 1, 2, 3...)
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề volume..."
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Nhập mô tả volume (tùy chọn)..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/novels/${novelId}/volumes`}>Hủy</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Đang tạo..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Tạo Volume
              </>
            )}
          </Button>
        </div>
      </form>
    </Container>
  );
}
