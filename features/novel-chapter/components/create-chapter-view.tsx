"use client";

import {
  ChapterForm,
  ChapterFormValues,
} from "@/components/forms/chapter-form";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ChapterService } from "@/features/novel-chapter/hooks/use-chapters";
import { useRouter } from "@/i18n/routing";
import { calculateContentStatistics } from "@/lib/editor/utils/text-statistics";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  readonly novelId: string;
  readonly volumeId: string;
}

export function CreateChapterView({ novelId, volumeId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ChapterFormValues) {
    setIsSubmitting(true);
    try {
      // Calculate word count and character count from content
      const { wordCount, characterCount } = calculateContentStatistics(
        values.content
      );

      await ChapterService.create(volumeId, {
        ...values,
        content: values.content,
        word_count: wordCount,
        character_count: characterCount,
        price: values.price || 0,
        currency: values.currency || "VND",
      });

      toast.success("Chapter created successfully");
      router.push(`/dashboard/novels/${novelId}/volumes/${volumeId}/chapters`);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to create chapter:", error);
      toast.error(error.message || "Failed to create chapter");
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold">Viết Chapter mới</h1>
            <p className="text-muted-foreground">
              Tạo chapter mới cho volume này
            </p>
          </div>
        </div>
      </div>

      <ChapterForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Tạo Chapter"
        volumeId={volumeId}
        novelId={novelId}
      />
    </Container>
  );
}
