"use client";

import { memo } from "react";
import Link from "next/link";
import { Crown, Heart, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

import { numberFormat } from "@/common/format-data/number-format";

type IProps = {
  userData: TopUser;
  index: number;
};

const TopUser: React.FC<IProps> = ({ userData, index }) => {
  return (
    <Link
      //TODO change it
      href={"/"}
      className={`${buttonVariants({
        variant: "outline",
        rounded: "lg",
      })} items-start h-fit w-full overflow-hidden flex flex-col gap-3 `}
    >
      <div className="flex gap-3 justify-items-start items-center w-full">
        <Avatar>
          <AvatarImage
            src={userData.image ?? "https://github.com/vercel.png"}
            className="object-cover"
            alt={userData.name}
          />
          <AvatarFallback>{userData.name}</AvatarFallback>
        </Avatar>

        <div className=" flex flex-col flex-wrap w-full relative overflow-hidden">
          <div className=" w-full flex gap-1 items-center">
            {index === 0 && <Crown className="text-yellow-500 size-4" />}
            <span className="text-sm whitespace-normal !line-clamp-1">
              {userData.name}
            </span>
          </div>
          <p className="text-xs whitespace-normal !line-clamp-1 w-full">
            {userData.username ? `@${userData.username}` : ""}
          </p>
        </div>
      </div>

      <div className="flex w-full gap-3 mx-3 border-t pt-3">
        <div className="flex gap-1 w-full items-center justify-center">
          <Heart className="size-4" />
          <span className="text-xs">{numberFormat(userData.like)}</span>
        </div>
        <div className="flex gap-1 w-full items-center justify-center">
          <Upload className="size-4" />
          <span className="text-xs">{userData.upload}</span>
        </div>
      </div>
    </Link>
  );
};

export default memo(TopUser);
