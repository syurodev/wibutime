import React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IProps = {
  url: string;
  className?: string;
  children: React.ReactNode;
};

const LinkButton: React.FC<IProps> = ({ url, className, children }) => {
  return (
    <Link
      href={url}
      className={cn(
        `h-fit transition-all duration-150 max-w-full line-clamp-1 hover:!decoration-dashed hover:bg-secondary rounded-md p-1 w-fit`,
        className
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
