import React from "react";
import Lightnovel from "@/components/page/Lightnovels/Lightnovel/Lightnovel";
import { useServerSession } from "@/hooks/server/useServerSession";

const LightnovelPage = async () => {
  console.log("session", await useServerSession());
  return <Lightnovel />;
};

export default LightnovelPage;
