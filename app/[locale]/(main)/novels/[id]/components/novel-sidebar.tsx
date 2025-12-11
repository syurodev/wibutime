import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Recommendation {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  image: string;
}

interface NovelSidebarProps {
  author: string;
  artist: string;
  releaseYear: number;
  status: string;
  volumesCount: number;
  chaptersCount: number;
  recommendations: Recommendation[];
}

export async function NovelSidebar({
  author,
  artist,
  releaseYear,
  status,
  volumesCount,
  chaptersCount,
  recommendations,
}: NovelSidebarProps) {
  const t = await useTranslations("novel.detail");

  return (
    <aside className="space-y-6">
      {/* Book Details */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">{t("bookDetails")}</h3>
        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("author")}</span>
            <span className="font-medium text-right">{author}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("artist")}</span>
            <span className="font-medium text-right">{artist}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("published")}</span>
            <span className="font-medium">{releaseYear}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("status")}</span>
            <Badge className="bg-green-100 text-green-700 border-0">
              {status}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("volumes")}</span>
            <span className="font-medium">{volumesCount}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t("chapters")}</span>
            <span className="font-medium">{chaptersCount}</span>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="font-semibold">{t("youMayAlsoLike")}</h3>

        <div className="space-y-3">
          {recommendations.map((item) => (
            <Link key={item.id} href="#" className="group block">
              <Card className="p-3 hover:shadow-md transition-all">
                <div className="flex gap-3">
                  <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground italic">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
