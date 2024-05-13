import React from "react";

import LightnovelDetailLeftSide from "./LightnovelDetailLeftSide";
import LightnovelDetailRightSide from "./LightnovelDetailRightSide";

type IProps = {};

const LightnovelDetailSection: React.FC = () => {
  return (
    <div className="relative flex flex-col md:flex-row gap-4">
      <LightnovelDetailRightSide />
      <LightnovelDetailLeftSide />
    </div>
  );
};

export default LightnovelDetailSection;
