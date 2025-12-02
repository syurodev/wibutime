/**
 * Dashboard Edit Novel Page
 * Form chỉnh sửa novel cá nhân
 */

"use client";

import {
  NovelForm,
  NovelFormData,
} from "@/components/features/novels/novel-form";
import { Container } from "@/components/layout/Container";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default function EditNovelPage({ params }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novelId, setNovelId] = useState<string>("");
  const [initialData, setInitialData] = useState<NovelFormData | undefined>(
    undefined
  );

  // Unwrap params and fetch data
  useEffect(() => {
    params.then((p) => {
      setNovelId(p.novelId);

      // TODO: Fetch novel details from API
      // Mock data for now
      setInitialData({
        title: "Mock Personal Novel",
        original_language: "vi",
        synopsis: "This is a mock synopsis for personal novel.",
        cover_url:
          "https://pub-555eabc68738400295d4791cd391a852.r2.dev/novel/mock-cover.jpg",
        status: "ongoing",
        is_oneshot: false,
        genre_ids: [],
        author_ids: [],
        artist_ids: [],
      });
    });
  }, [params]);

  const handleSubmit = async (formData: NovelFormData) => {
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        owner_type: "user",
      };

      // TODO: Call API to update novel
      console.log("Updating novel:", submitData);

      toast.success("Novel đã được cập nhật thành công!");
      router.push("/dashboard/novels");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật novel");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="2xl" className="py-8 max-w-5xl">
      <NovelForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backUrl="/dashboard/novels"
        title="Chỉnh sửa Novel"
        description="Cập nhật thông tin novel cá nhân"
        ownerInfo={
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium">Chủ sở hữu:</p>
            <span className="text-sm text-muted-foreground">
              Bạn (Personal)
            </span>
          </div>
        }
      />
    </Container>
  );
}
