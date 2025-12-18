"use client";

import { updateNovel } from "@/features/novel/actions";
import {
  NovelForm,
  NovelFormData,
} from "@/features/novel/components/novel-form";
import { type NovelBackend } from "@/features/novel/types";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  novelId: string;
  initialData: NovelBackend;
}

export function EditNovelClient({ novelId, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform backend data to form data
  const formData: NovelFormData = {
    title: initialData.title,
    original_title: initialData.original_title || "",
    original_language: initialData.original_language || "vi",
    synopsis: initialData.synopsis, // Note: This might need parsing if it's a JSON string
    cover_url: initialData.cover_image_url || "",
    status: initialData.status,
    is_oneshot: initialData.is_oneshot,
    genre_ids: initialData.genre_ids || [],
    author_ids: initialData.author_ids || [],
    artist_ids: initialData.artist_ids || [],
  };

  const handleSubmit = async (data: NovelFormData) => {
    setIsSubmitting(true);

    try {
      await updateNovel(novelId, {
        title: data.title,
        original_title: data.original_title,
        original_language: data.original_language,
        synopsis: data.synopsis,
        cover_image_url: data.cover_url,
        thumbnail_url: data.cover_url, // Use same image for now
        status: data.status,
        is_oneshot: data.is_oneshot,
        metadata: initialData.metadata, // Preserve metadata or update if needed
      });

      toast.success("Novel đã được cập nhật thành công!");
      router.push("/dashboard/novels");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật novel");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NovelForm
      initialData={formData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      backUrl="/dashboard/novels"
      title="Chỉnh sửa Novel"
      description="Cập nhật thông tin novel cá nhân"
      ownerInfo={
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium">Chủ sở hữu:</p>
          <span className="text-sm text-muted-foreground">Bạn (Personal)</span>
        </div>
      }
      initialSelectedGenres={initialData.genres.map((g) => ({
        label: g.name,
        value: g.id,
      }))}
      initialSelectedAuthors={initialData.authors.map((a) => ({
        label: a.name,
        value: a.id,
      }))}
      initialSelectedArtists={initialData.artists.map((a) => ({
        label: a.name,
        value: a.id,
      }))}
    />
  );
}
