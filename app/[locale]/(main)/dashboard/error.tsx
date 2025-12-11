"use client";

/**
 * Dashboard Error Boundary
 */

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, BarChart3, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  const t = useTranslations("common.error");

  return (
    <Container maxWidth="2xl" className="py-8">
      <Card className="p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-16 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">{t("dashboardTitle")}</h1>

        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t("dashboardDescription")}
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="size-4" />
            {t("retry")}
          </Button>

          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a href="/dashboard/novels">
              <BarChart3 className="size-4" />
              {t("viewNovels")}
            </a>
          </Button>
        </div>
      </Card>
    </Container>
  );
}
