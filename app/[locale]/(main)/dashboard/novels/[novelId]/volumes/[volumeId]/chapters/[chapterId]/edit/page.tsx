"use client";

import {
  ChapterForm,
  ChapterFormValues,
} from "@/components/forms/chapter-form";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { getChapter, updateChapter } from "@/lib/api/chapters";
import { calculateContentStatistics } from "@/lib/editor/utils/text-statistics";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{
    novelId: string;
    volumeId: string;
    chapterId: string;
  }>;
}

export default function EditChapterPage({ params }: Props) {
  const { novelId, volumeId, chapterId } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] =
    useState<Partial<ChapterFormValues>>();

  useEffect(() => {
    async function fetchChapter() {
      try {
        const response = await getChapter(chapterId);
        if (response.data) {
          const chapter = response.data;
          setInitialValues({
            chapter_number: chapter.chapter_number,
            title: chapter.title,
            content: chapter.content, // Assuming content is already JSON
            status: chapter.status as any,
            is_free: chapter.is_free,
            price: chapter.price,
            currency: chapter.currency,
          });
        }
      } catch (error) {
        console.error("Failed to fetch chapter:", error);
        toast.error("Failed to load chapter details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchChapter();
  }, [chapterId]);

  async function onSubmit(values: ChapterFormValues) {
    setIsSubmitting(true);
    try {
      // Calculate word count and character count from content
      const { wordCount, characterCount } = calculateContentStatistics(
        values.content
      );

      await updateChapter(chapterId, {
        ...values,
        content: values.content,
        word_count: wordCount,
        character_count: characterCount,
        price: values.price || 0,
        currency: values.currency || "VND",
        volume_id: volumeId,
      });

      toast.success("Chapter updated successfully");
      router.push(`/dashboard/novels/${novelId}/volumes/${volumeId}/chapters`);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to update chapter:", error);
      toast.error(error.message || "Failed to update chapter");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="full" className="py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Container>
    );
  }

  return (
    <Container maxWidth="full" className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(
                `/dashboard/novels/${novelId}/volumes/${volumeId}/chapters`
              )
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chỉnh sửa Chapter</h1>
            <p className="text-muted-foreground">Cập nhật nội dung chapter</p>
          </div>
        </div>
      </div>

      <ChapterForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Lưu thay đổi"
      />
    </Container>
  );
}
