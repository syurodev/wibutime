import { ContinueCarousel } from "@/components/home/ContinueCarousel";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { HistoryMedia } from "@/lib/api/models/content/history-content";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export interface ContinueSectionProps {
  readonly history: HistoryMedia[];
}

export async function ContinueSection({ history }: ContinueSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="w-full py-10">
      <Container maxWidth="xl">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("continue.title")}
            </h2>
            <p className="text-muted-foreground">{t("continue.subtitle")}</p>
          </div>

          {/* See All Link */}
          <Button variant="ghost" className="group gap-2" asChild>
            <Link href="/history">
              {t("common.seeAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {history && history.length > 0 ? (
          <ContinueCarousel history={history} />
        ) : (
          <div className="rounded-2xl border border-dashed border-muted-foreground/40 p-10 text-center text-sm text-muted-foreground">
            {t("continue.empty")}
          </div>
        )}
      </Container>
    </section>
  );
}
