"use client";

import React, { FC, ReactNode, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type IProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

const DivSlide: FC<IProps> = ({ delay, className, children }) => {
  return (
    <motion.div
      layout
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
          delay: delay ?? 0,
        },
      }}
      exit={{
        y: -50,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
      }}
      className={cn("w-full h-full", className)}
    >
      {children}
    </motion.div>
  );
};

export default memo(DivSlide);
