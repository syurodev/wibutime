import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { buttonVariants } from "@/components/ui/button";

import { NavigationHeaderMenu } from "./NavigationHeaderMenu/NavigationHeaderMenu";
import LoginButton from "../Button/LoginButton";
import DivSlide from "../Animation/DivSlide";

const ThemeToggle = dynamic(() => import("../Button/ThemeToggle"), {
  ssr: false,
});

const Header = () => {
  return (
    <div className="px-3 fixed top-4 z-50 w-screen">
      <DivSlide className="max-w-[1000px] w-full h-14 px-3 rounded-full border mx-auto bg-background/50 backdrop-blur-md flex items-center justify-between gap-1 md:gap-3">
        {/* <AnimationLogo loop={false} showName={false} size="sm" /> */}
        <div className="flex items-center gap-1 md:gap-3">
          <DivSlide delay={0.02}>
            <Link
              href={"/"}
              className={`${buttonVariants({
                variant: "outline",
                rounded: "full",
              })} bg-background/30 hidden md:block`}
              // className="text-sm font-semibold"
            >
              Wibutime
            </Link>
            <Link
              href={"/"}
              className={`${buttonVariants({
                variant: "outline",
                rounded: "full",
              })} bg-background/30 md:hidden`}
              // className="text-sm font-semibold"
            >
              W
            </Link>
          </DivSlide>
          <NavigationHeaderMenu />
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle size="icon" blur={true} />
          <LoginButton size="icon" delay={0.2} blur={true} />
        </div>
      </DivSlide>
    </div>
  );
};

export default React.memo(Header);
