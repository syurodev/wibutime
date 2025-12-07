"use client";

/**
 * Homepage Error Boundary
 */

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ error, reset }: ErrorProps) {
  const t = useTranslations("common.error");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container maxWidth="md">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-amber-500/10 p-4">
              <AlertTriangle className="size-12 text-amber-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>

          <p className="text-muted-foreground mb-6">{t("description")}</p>

          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="size-4" />
              {t("retry")}
            </Button>

            <Button variant="outline" className="gap-2" asChild>
              <a href="/">
                <Home className="size-4" />
                {t("home")}
              </a>
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
