"use client";

import { AccountNavigation } from "@/components/features/account/account-navigation";
import { ProfileForm } from "@/components/features/account/profile-form";
import { Container } from "@/components/layout/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { UserProfile } from "@/features/user/types";
import { useTranslations } from "next-intl";

interface ProfileClientPageProps {
  user: UserProfile;
}

export default function ProfileClientPage({ user }: ProfileClientPageProps) {
  const t = useTranslations("account.profile");

  return (
    <Container maxWidth="2xl">
      <AccountNavigation />
      <div className="space-y-8">
        <PageHeader
          heading={t("title")}
          description="Update your personal information and public profile."
        />
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              Manage how others see you on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm initialData={user} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
