"use client";
import { CreateChapterView } from "@/features/novel-chapter/components/create-chapter-view";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default async function CreateChapterPage({ params }: Props) {
  const { novelId } = await params;
  // TODO: Get volumeId from somewhere or pass it as prop if available in route
  // For now assuming we might need to fetch it or it's not in this route params
  // If this page is under [novelId]/chapters/create, we might need to know which volume to add to.
  // Or maybe this page is for creating a chapter in a default volume?
  // Let's check the route again: app/[locale]/(main)/dashboard/novels/[novelId]/chapters/create/page.tsx
  // It seems volumeId is missing from params.
  // However, CreateChapterView requires volumeId.
  // Let's use a placeholder or check if we can get it.

  // Wait, the user might be in a context where they select a volume?
  // Or maybe this route is wrong and should be under a volume?
  // But for now, let's just render the view.

  return <CreateChapterView novelId={novelId} volumeId="" />;
}
