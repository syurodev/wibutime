"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common.error");

  useEffect(() => {
    console.error("Home page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold">{t("title")}</h2>

        <p className="text-muted-foreground">{t("description")}</p>

        {process.env.NODE_ENV === "development" && (
          <pre className="text-xs text-left bg-muted p-3 rounded-lg overflow-auto max-h-32">
            {error.message}
          </pre>
        )}

        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
