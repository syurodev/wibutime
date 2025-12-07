/**
 * Workspace Edit Novel Page
 * Form chỉnh sửa novel
 */

"use client";

import {
  NovelForm,
  NovelFormData,
} from "@/components/features/novels/novel-form";
import { Container } from "@/components/layout/Container";
import { useRouter } from "@/i18n/routing";
import { updateNovel } from "@/features/novel/actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    tenantId: string;
    novelId: string;
  }>;
}

export default function EditNovelPage({ params }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [novelId, setNovelId] = useState<string>("");
  const [initialData, setInitialData] = useState<NovelFormData | undefined>(
    undefined
  );

  // Unwrap params and fetch data
  useEffect(() => {
    params.then((p) => {
      setTenantId(p.tenantId);
      setNovelId(p.novelId);

      // TODO: Fetch novel details from API
      // Mock data for now
      setInitialData({
        title: "Mock Workspace Novel",
        original_title: "Mock Original Title",
        original_language: "vi",
        synopsis: [
          {
            type: "p",
            children: [
              { text: "This is a mock synopsis for workspace novel." },
            ],
          },
        ],
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
      const payload = {
        title: formData.title,
        original_title: formData.original_title,
        original_language: formData.original_language,
        synopsis: formData.synopsis,
        cover_image_url: formData.cover_url,
        status: formData.status,
        is_oneshot: formData.is_oneshot,
        genre_ids: formData.genre_ids,
        author_ids: formData.author_ids,
        artist_ids: formData.artist_ids,
        owner_type: "group",
        owner_id: tenantId,
      };

      // Call API to update novel
      console.log("Calling updateNovel action...");
      const updatedNovel = await updateNovel(novelId, payload);
      console.log("Novel updated:", updatedNovel);

      toast.success("Novel đã được cập nhật thành công!");
      router.push(`/workspace/${tenantId}/novels`);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật novel");
      console.error("Update novel error:", error);
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
        backUrl={`/workspace/${tenantId}/novels`}
        title="Chỉnh sửa Novel"
        description="Cập nhật thông tin novel"
        ownerInfo={
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium">Chủ sở hữu:</p>
            <span className="text-sm text-muted-foreground">
              Team (Tenant ID: {tenantId})
            </span>
          </div>
        }
      />
    </Container>
  );
}
