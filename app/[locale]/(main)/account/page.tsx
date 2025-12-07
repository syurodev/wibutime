import { getUserProfile } from "@/features/user/queries";
import { redirect } from "next/navigation";
import { default as ProfileClientPage } from "./page-client";

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login"); // or handle error
  }

  return <ProfileClientPage user={user} />;
}
