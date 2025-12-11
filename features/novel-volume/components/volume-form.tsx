"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export interface VolumeFormData {
  title: string;
  description?: string;
  cover_image_url?: string;
}

interface VolumeFormProps {
  initialData?: VolumeFormData;
  onSubmit: (data: VolumeFormData) => Promise<void>;
  isSubmitting: boolean;
  backUrl: string;
  title: string;
  description?: string;
}

export function VolumeForm({
  initialData,
  onSubmit,
  isSubmitting,
  backUrl,
  title,
  description,
}: VolumeFormProps) {
  const [formData, setFormData] = useState<VolumeFormData>(
    initialData || {
      title: "",
      description: "",
      cover_image_url: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={backUrl}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bên trái: Upload ảnh cover */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Label>Ảnh Cover Volume</Label>
                <FileUploader
                  value={formData.cover_image_url}
                  onValueChange={(url) =>
                    setFormData((prev) => ({ ...prev, cover_image_url: url }))
                  }
                  type="novel"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Kích thước khuyến nghị: 600x900px (tùy chọn)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bên phải: Form fields */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Info alert */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    💡 Số thứ tự volume sẽ được tự động tính toán
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tiêu đề <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Nhập tiêu đề volume..."
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Nhập mô tả volume (tùy chọn)..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={backUrl}>Hủy</Link>
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
    </div>
  );
}
