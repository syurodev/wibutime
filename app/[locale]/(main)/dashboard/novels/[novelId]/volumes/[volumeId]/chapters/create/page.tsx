import { CreateChapterView } from "@/features/chapters/components/create-chapter-view";
import { use } from "react";

interface Props {
  params: Promise<{
    novelId: string;
    volumeId: string;
  }>;
}

export default function CreateChapterPage({ params }: Props) {
  const { novelId, volumeId } = use(params);

  return <CreateChapterView novelId={novelId} volumeId={volumeId} />;
}
