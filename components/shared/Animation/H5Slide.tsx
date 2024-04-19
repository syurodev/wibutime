"use client";

import React, { FC, ReactNode, memo } from "react";
import { motion } from "framer-motion";

type IProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

const H5Slide: FC<IProps> = ({ delay, className, children }) => {
  return (
    <motion.h3
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
      className={className}
    >
      {children}
    </motion.h3>
  );
};

export default memo(H5Slide);
