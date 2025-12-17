import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-7 has-[>svg]:px-5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Liquid glass effect styles
 * Can be combined with any variant - preserves variant's background color
 * Auto-enabled when html has data-glass-effect="liquid" attribute
 */
const liquidStyles = cn(
  // Base liquid glass styling
  "relative isolate overflow-hidden",
  // Smooth transitions for all hover effects
  "transition-all duration-300 ease-out",
  // Glass border (semi-transparent white border for glass look)
  "border border-white/30 dark:border-white/20",
  // Glass shadow with inner glow
  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.12)]",
  // Hover states
  "hover:border-white/50 dark:hover:border-white/30",
  "hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_16px_48px_rgba(0,0,0,0.15)]",
  "hover:scale-[1.02] active:scale-[0.98]",
  // Gradient overlay via pseudo-element (white highlight at top)
  "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none",
  // Liquid glass blur effect with SVG filter
  "[backdrop-filter:blur(20px)_url(#liquid-glass-filter-light)]",
  "[-webkit-backdrop-filter:blur(20px)_url(#liquid-glass-filter-light)]"
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  /**
   * Enable liquid glass effect
   * - `true`: Always enable liquid effect
   * - `false`: Always disable liquid effect
   * - `"auto"` (default): Auto-enable based on data-glass-effect attribute on html element
   */
  readonly liquid?: boolean | "auto";
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  liquid = "auto",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // Variants that should naturally NOT have the liquid glass effect (no background/border)
  const isExcludedVariant = variant === "ghost" || variant === "link";

  // When liquid="auto", use CSS to conditionally apply styles based on html[data-glass-effect="liquid"]
  // but SKIP if it's an excluded variant (unless explicitly forced with liquid={true})
  const isExplicitLiquid = liquid === true;
  const isAutoLiquid = liquid === "auto" && !isExcludedVariant;

  // Determine data-liquid attribute value
  let liquidAttr: boolean | "auto" | undefined;
  if (isExplicitLiquid) {
    liquidAttr = true;
  } else if (isAutoLiquid) {
    liquidAttr = "auto";
  }

  return (
    <Comp
      data-slot="button"
      data-liquid={liquidAttr}
      className={cn(
        buttonVariants({ variant, size }),
        isExplicitLiquid && liquidStyles,
        className
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants, liquidStyles };
