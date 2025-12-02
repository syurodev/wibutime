"use client";

/**
 * Novel Detail Error Boundary
 */

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NovelDetailError({ error, reset }: ErrorProps) {
  const t = useTranslations("common.error");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container maxWidth="md">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="size-12 text-destructive" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {t("title") || "Oops! Something went wrong"}
          </h1>

          <p className="text-muted-foreground mb-6">
            {t("description") ||
              "We couldn't load this novel. Please try again."}
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="size-4" />
              {t("retry") || "Try Again"}
            </Button>

            <Button variant="outline" className="gap-2" asChild>
              <a href="/">
                <Home className="size-4" />
                {t("home") || "Back to Home"}
              </a>
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
