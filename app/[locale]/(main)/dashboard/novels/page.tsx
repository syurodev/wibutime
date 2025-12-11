/**
 * Dashboard Novels List Page
 * Danh sách novels cá nhân
 */

import { NovelList } from "@/components/dashboard/novels/novel-list";
import { Container } from "@/components/layout/container";
import { NovelService } from "@/features/novel/service";
import { getSession } from "@/lib/auth/session";
import { DEFAULT_LIMIT } from "@/lib/constants/default";
export default async function DashboardNovelsPage() {
  const session = await getSession();
  const token = session?.accessToken;
  const userId = session?.user?.id;

  const response = await NovelService.getList({
    owner: userId, // Pass actual user ID
    limit: DEFAULT_LIMIT,
    token: token,
  });

  console.log(response);

  const novels = response.data || [];

  return (
    <Container maxWidth="2xl" className="py-8">
      <NovelList novels={novels} />
    </Container>
  );
}
