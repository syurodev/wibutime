import { Badge } from "@/components/ui/badge";
import { StaticEditorView } from "@/features/editor/components/static-editor-view";
import { useTranslations } from "next-intl";
import type { TNode } from "platejs";

interface NovelSynopsisProps {
  description: TNode[];
  tags: string[];
}

export async function NovelSynopsis({ description, tags }: NovelSynopsisProps) {
  const t = await useTranslations("novel.detail");

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{t("synopsis")}</h2>
      <StaticEditorView
        content={description}
        variant="compact"
        className="text-base text-muted-foreground leading-relaxed"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-primary/10"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </section>
  );
}
