import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        anime:
          "border-transparent bg-anime text-secondary-foreground hover:bg-anime/80",
        animeOutline:
          "border-anime bg-background text-secondary-foreground hover:bg-anime/60",
        manga:
          "border-transparent bg-manga text-secondary-foreground hover:bg-manga/80",
        mangaOutline:
          "border-manga bg-background text-secondary-foreground hover:bg-manga/60",
        lightnovel:
          "border-transparent bg-lightnovel text-secondary-foreground hover:bg-lightnovel/80",

        lightnovelOutline:
          "border-lightnovel bg-background text-secondary-foreground hover:bg-lightnovel/60",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
