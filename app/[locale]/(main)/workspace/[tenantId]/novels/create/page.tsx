/**
 * Workspace Create Novel Page
 * Form tạo novel mới (owner_type = 'tenant')
 */

"use client";

import {
  NovelForm,
  NovelFormData,
} from "@/components/features/novels/novel-form";
import { Container } from "@/components/layout/container";
import { createNovel } from "@/features/novel/actions";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    tenantId: string;
  }>;
}

export default function CreateNovelPage({ params }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");

  // Unwrap params
  useEffect(() => {
    params.then((p) => setTenantId(p.tenantId));
  }, [params]);

  const handleSubmit = async (formData: NovelFormData) => {
    console.log("CreateNovelPage: handleSubmit triggered");
    setIsSubmitting(true);

    try {
      // Remove cover_url from data sent to API if strict, but spreading formData includes it.
      // Ideally construct a clean object.
      const payload = {
        title: formData.title,
        original_title: formData.original_title,
        original_language: formData.original_language,
        synopsis: formData.synopsis,
        cover_image_url: formData.cover_url || undefined, // Send undefined if empty string
        status: formData.status,
        is_oneshot: formData.is_oneshot,
        genre_ids: formData.genre_ids,
        author_ids: formData.author_ids,
        artist_ids: formData.artist_ids,
        owner_type: "group",
        owner_id: tenantId,
      };

      // ...

      // Call API to create novel
      console.log("Calling createNovel action...");
      const novel = await createNovel(payload);
      console.log("Novel created:", novel);

      toast.success("Novel đã được tạo thành công!");
      router.push(`/workspace/${tenantId}/novels`);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi tạo novel");
      console.error("Create novel error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="2xl" className="py-8 max-w-5xl">
      <NovelForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backUrl={`/workspace/${tenantId}/novels`}
        title="Tạo Novel mới"
        description="Tạo novel cho team (Chủ sở hữu: Team)"
        submitLabel="Tạo Novel"
        ownerInfo={
          <>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">Chủ sở hữu:</p>
              <span className="text-sm text-muted-foreground">
                Team (Tenant ID: {tenantId})
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Novel này sẽ được tạo dưới quyền sở hữu của team
            </p>
          </>
        }
      />
    </Container>
  );
}
