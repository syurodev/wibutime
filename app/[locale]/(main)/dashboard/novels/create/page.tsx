/**
 * Dashboard Create Novel Page
 * Form tạo novel mới (owner_type = 'user')
 */

"use client";

import {
  NovelForm,
  NovelFormData,
} from "@/components/features/novels/novel-form";
import { Container } from "@/components/layout/Container";
import { useRouter } from "@/i18n/routing";
import { createNovel } from "@/lib/api/actions/novel";
import { useAuth } from "@/lib/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNovelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();

  const handleSubmit = async (formData: NovelFormData) => {
    console.log("CreateNovelPage (Dashboard): handleSubmit triggered");
    console.log("CreateNovelPage (Dashboard): User state:", {
      user,
      isLoading,
    });

    setIsSubmitting(true);

    try {
      if (isLoading) {
        throw new Error(
          "Đang tải thông tin người dùng, vui lòng thử lại sau giây lát"
        );
      }

      if (!user?.id) {
        throw new Error(
          "Không tìm thấy thông tin người dùng (User ID missing)"
        );
      }

      const payload = {
        title: formData.title,
        original_title: formData.original_title || formData.title, // Fallback to title if empty
        original_language: formData.original_language,
        synopsis: formData.synopsis,
        cover_image_url: formData.cover_url || undefined, // Send undefined if empty string
        status: formData.status,
        is_oneshot: formData.is_oneshot,
        genre_ids: formData.genre_ids,
        author_ids: formData.author_ids,
        artist_ids: formData.artist_ids,
        owner_type: "user",
        owner_id: user.id,
      };

      // Call API to create novel
      console.log("Calling createNovel action...", payload);
      const novel = await createNovel(payload);
      console.log("Novel created:", novel);

      toast.success("Novel đã được tạo thành công!");
      router.push("/dashboard/novels");
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
        backUrl="/dashboard/novels"
        title="Tạo Novel mới"
        description="Tạo novel cá nhân (Chủ sở hữu: Bạn)"
        submitLabel="Tạo Novel"
        ownerInfo={
          <>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">Chủ sở hữu:</p>
              <span className="text-sm text-muted-foreground">
                Bạn (Personal)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Novel này sẽ được tạo dưới quyền sở hữu cá nhân của bạn
            </p>
          </>
        }
      />
    </Container>
  );
}
