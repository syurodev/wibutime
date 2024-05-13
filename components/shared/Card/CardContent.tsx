import React from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type IProps = {
  data: ContentCardType;
  direction?: "horizontal" | "vertical";
  className?: string;
};

const ContentCard: React.FC<IProps> = ({
  className,
  data,
  direction = "horizontal",
}) => {
  return (
    <Link href={`/${data.type}s/${data.url_id}`}>
      {direction === "horizontal" ? (
        <Card
          className={cn(
            "aspect-[2/3] w-full min-w-[100px] rounded-lg relative overflow-hidden group shadow",
            className
          )}
        >
          <div className="absolute w-full h-full top-full left-0 bg-background/50 backdrop-blur-md z-10 group-hover:top-5 duration-500 group-hover:rounded-t-lg transition-all ease-in-out p-3 flex flex-col gap-3">
            <h4 className="text-sm line-clamp-4 font-semibold">{data.name}</h4>

            <small className="line-clamp-3">
              <span className="font-semibold">
                {data.type === "anime" ? "Episode: " : "Chapter: "}
              </span>
              {data.current}
            </small>
          </div>

          <Image
            src={data.image ?? "/images/default-content-image.webp"}
            alt={data.name}
            fill
            sizes="full"
            priority
            className="object-cover z-0 group-hover:brightness-75 transition-all duration-300"
          />
        </Card>
      ) : (
        <Card className="p-3 flex flex-row gap-2">
          <div className="relative aspect-[2/3] flex-none w-full max-w-[100px] rounded-md overflow-hidden">
            <Image
              src={data.image ?? "/images/default-content-image.webp"}
              alt={data.name}
              fill
              sizes="full"
              priority
              className="object-cover"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold line-clamp-3">{data.name}</h4>
          </div>
        </Card>
      )}
    </Link>
  );
};

export default ContentCard;
