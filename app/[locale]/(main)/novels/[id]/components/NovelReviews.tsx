import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatNumberAbbreviated } from "@/lib/api/utils/number";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  comment: string;
  rating: number;
  time: string;
}

interface NovelReviewsProps {
  rating: number;
  ratingCount: number;
  reviews: Review[];
}

export async function NovelReviews({
  rating,
  ratingCount,
  reviews,
}: NovelReviewsProps) {
  const t = await useTranslations("novel.detail");

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("readerReviews")}</h2>
        <Button variant="outline" size="sm">
          {t("writeReview")}
        </Button>
      </div>

      {/* Rating Summary */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-bold mb-2">{rating}</div>
            <div className="flex items-center gap-1 justify-center sm:justify-start mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "size-5",
                    star <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatNumberAbbreviated(ratingCount)} {t("ratings")}
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-12">
                  {stars} star
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{
                      width: `${
                        stars === 5
                          ? 70
                          : stars === 4
                          ? 20
                          : stars === 3
                          ? 8
                          : 2
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {stars === 5
                    ? "70%"
                    : stars === 4
                    ? "20%"
                    : stars === 3
                    ? "8%"
                    : "2%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex gap-4">
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={review.user.avatar} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "size-4",
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.time}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
