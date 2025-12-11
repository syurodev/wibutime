/**
 * Workspace Overview Page
 * Tổng quan workspace của tenant với thống kê chi tiết và biểu đồ
 */

import { Container } from "@/components/layout/container";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{
    tenantId: string;
  }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { tenantId } = await params;
  const t = await getTranslations("workspace");

  return (
    <Container maxWidth="2xl" className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("description")}</p>
        </div>
      </div>
    </Container>
  );
}
