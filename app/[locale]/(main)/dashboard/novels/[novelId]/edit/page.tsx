/**
 * Dashboard Edit Novel Page
 * Form chỉnh sửa novel cá nhân
 */

import { Container } from "@/components/layout/container";
import { getNovelById } from "@/features/novel/queries";
import { EditNovelClient } from "./client";

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default async function EditNovelPage({ params }: Props) {
  const { novelId } = await params;

  // Fetch novel data
  const novel = await getNovelById(novelId);

  console.log(novel);

  return (
    <Container maxWidth="2xl" className="py-8 max-w-5xl">
      <EditNovelClient novelId={novelId} initialData={novel} />
    </Container>
  );
}
