import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { HistoryMedia } from "@/features/history/types";
import { Link } from "@/i18n/routing";
import { getCurrentTime } from "@/lib/utils/time-cache";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContinueCarousel } from "./continue-carousel";

export interface ContinueSectionProps {
  readonly history: HistoryMedia[];
}

export async function ContinueSection({ history }: ContinueSectionProps) {
  const t = await getTranslations("home");
  const currentTime = await getCurrentTime();

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
          <ContinueCarousel history={history} currentTime={currentTime} />
        ) : (
          <div className="rounded-2xl border border-dashed border-muted-foreground/40 p-10 text-center text-sm text-muted-foreground">
            {t("continue.empty")}
          </div>
        )}
      </Container>
    </section>
  );
}
