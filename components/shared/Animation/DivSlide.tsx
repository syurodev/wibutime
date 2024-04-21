"use client";

import React, {
  forwardRef,
  ReactNode,
  memo,
  AnimationEventHandler,
} from "react";
import { AnimationProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DivSlideProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
} & AnimationProps; // Mở rộng HTMLAttributes để bổ sung thuộc tính delay

const DivSlide = forwardRef<HTMLDivElement, DivSlideProps>(
  ({ delay, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{
          y: 50,
          opacity: 0,
          // scale: 1.2
        }}
        animate={{
          y: 0,
          opacity: 1,
          // scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
            delay: delay ?? 0,
          },
        }}
        exit={{
          y: -50,
          opacity: 0,
          // scale: 0.8,
          transition: {
            duration: 0.3,
            ease: [0.65, 0, 0.35, 1],
            delay: delay ? delay / 6 : 0,
          },
        }}
        className={cn("w-full h-full", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

DivSlide.displayName = "DivSlide";
export default memo(DivSlide);
