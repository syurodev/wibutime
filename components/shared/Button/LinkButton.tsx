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
        `${buttonVariants({
          variant: "link",
        })} p-0 h-fit transition-all duration-150`,
        className
      )}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
