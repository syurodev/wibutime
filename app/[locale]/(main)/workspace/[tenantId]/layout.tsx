/**
 * Workspace Layout - Server Component
 * Tenant workspace layout với shadcn/ui sidebar
 */

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { WorkspaceSidebar } from "./workspace-sidebar";

export const metadata: Metadata = {
  title: "Workspace - WibuTime",
  description: "Quản lý nội dung của team",
};

import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    tenantId: string;
    locale: string;
  }>;
}

export default async function WorkspaceLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <SidebarLoader params={params} />
      </Suspense>
      <SidebarInset className="px-4 md:px-6">
        <div className="pb-20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function SidebarLoader({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  return <WorkspaceSidebar tenantId={tenantId} />;
}
