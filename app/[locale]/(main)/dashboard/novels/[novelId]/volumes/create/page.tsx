/**
 * Dashboard Create Volume Page
 * Form tạo volume mới cho novel
 */

"use client";

import {
  VolumeForm,
  VolumeFormData,
} from "@/components/features/volumes/volume-form";
import { Container } from "@/components/layout/Container";
import { NovelVolumeService } from "@/features/novel-volume/service";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default function CreateVolumePage({ params }: Props) {
  const router = useRouter();
  const [novelId, setNovelId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setNovelId(p.novelId));
  }, [params]);

  const handleSubmit = async (formData: VolumeFormData) => {
    setIsSubmitting(true);

    try {
      // Backend sẽ tự tính volume_number
      await NovelVolumeService.create(novelId, {
        title: formData.title,
        description: formData.description,
        cover_image_url: formData.cover_image_url,
        display_order: 0, // Backend sẽ set = volume_number
        is_published: false,
      });

      toast.success("Volume đã được tạo thành công!");
      router.push(`/dashboard/novels/${novelId}/volumes`);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi tạo volume");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!novelId) {
    return (
      <Container maxWidth="2xl" className="py-8">
        Loading...
      </Container>
    );
  }

  return (
    <Container maxWidth="full" className="py-8">
      <VolumeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backUrl={`/dashboard/novels/${novelId}/volumes`}
        title="Tạo Volume mới"
        description="Thêm volume mới cho novel"
      />
    </Container>
  );
}
