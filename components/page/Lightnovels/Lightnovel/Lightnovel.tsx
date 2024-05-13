import React from "react";

import ContentDetailHeroSection from "@/components/shared/Section/ContentDetailHeroSection";
import LightnovelDetailSection from "@/components/shared/Section/LightnovelDetailSection";

const Lightnovel = () => {
  return (
    <div className="pt-[82px] w-full max-w-[1300px] mx-auto min-h-dvh h-full overflow-y-auto flex flex-col gap-4 items-center px-4 pb-4">
      <ContentDetailHeroSection />
      <LightnovelDetailSection />
    </div>
  );
};

export default Lightnovel;
