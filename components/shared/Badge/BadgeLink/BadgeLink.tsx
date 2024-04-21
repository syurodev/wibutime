import React from "react";
import Link from "next/link";

import {
  Badge,
  // badgeVariants
} from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DivSlide from "../../Animation/DivSlide";

type IProps = {
  url: string;
  variant:
    | "anime"
    | "manga"
    | "lightnovel"
    | "default"
    | "secondary"
    | "animeOutline"
    | "mangaOutline"
    | "lightnovelOutline"
    | "destructive"
    | "outline"
    | null
    | undefined;
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

const BadgeLink: React.FC<IProps> = ({
  url,
  variant,
  delay,
  className,
  children,
}) => {
  return (
    <Link href={url}>
      <DivSlide delay={delay ?? 0}>
        <Badge variant={variant} className={cn("rounded-full", className)}>
          {children}
        </Badge>
      </DivSlide>
    </Link>
  );
};

export default React.memo(BadgeLink);
