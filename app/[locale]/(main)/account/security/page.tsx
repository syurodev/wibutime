import { getUserSessions } from "@/features/user/queries";
import { default as SecurityClientPage } from "./page-client";

export default async function SecurityPage() {
  const sessions = await getUserSessions();

  return <SecurityClientPage sessions={sessions || []} />;
}
