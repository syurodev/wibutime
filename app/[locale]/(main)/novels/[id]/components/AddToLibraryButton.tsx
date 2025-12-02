"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AddToLibraryButtonProps {
  novelId: string;
  initialBookmarked?: boolean;
}

export function AddToLibraryButton({
  novelId,
  initialBookmarked = false,
}: AddToLibraryButtonProps) {
  const t = useTranslations("novel.detail");
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleToggle = () => {
    // TODO: Call API to bookmark/unbookmark
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Button
      size="lg"
      variant={isBookmarked ? "secondary" : "outline"}
      className="gap-2"
      onClick={handleToggle}
    >
      <Heart className={cn("size-4", isBookmarked && "fill-current")} />
      {isBookmarked ? t("bookmarked") : t("addToLibrary")}
    </Button>
  );
}
