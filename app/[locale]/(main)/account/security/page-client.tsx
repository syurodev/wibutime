"use client";

import { AccountNavigation } from "@/components/features/account/account-navigation";
import { PasswordForm } from "@/components/features/account/password-form";
import { SessionList } from "@/components/features/account/session-list";
import { Container } from "@/components/layout/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { UserSessions } from "@/features/user/types";
import { useTranslations } from "next-intl";

interface SecurityClientPageProps {
  sessions: UserSessions;
}

export default function SecurityClientPage({
  sessions,
}: SecurityClientPageProps) {
  const t = useTranslations("account.security");

  return (
    <Container maxWidth="2xl">
      <AccountNavigation />

      <div className="space-y-8">
        <PageHeader
          heading="Security"
          description="Manage your password and active sessions."
        />

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("password.title")}</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        {/* Sessions Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("sessions.title")}</CardTitle>
            <CardDescription>{t("sessions.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList initialSessions={sessions} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
