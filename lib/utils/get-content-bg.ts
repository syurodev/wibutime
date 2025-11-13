import { CONTENT_TYPE } from "../constants/default";

type IGetContentBg = {
  readonly type: CONTENT_TYPE;
  blur?: boolean;
};

export const getContentBg = ({ type, blur = false }: IGetContentBg) => {
  switch (type) {
    case CONTENT_TYPE.ANIME:
      return blur
        ? "bg-cyan-500/70 backdrop-blur-md hover:bg-cyan-600/70"
        : "bg-cyan-500 hover:bg-cyan-600";
    case CONTENT_TYPE.MANGA:
      return blur
        ? "bg-purple-500/70 backdrop-blur-md hover:bg-purple-600/70"
        : "bg-purple-500 hover:bg-purple-600";
    case CONTENT_TYPE.NOVEL:
      return blur
        ? "bg-teal-500/70 backdrop-blur-md hover:bg-teal-600/70"
        : "bg-teal-500 hover:bg-teal-600";
    default:
      return blur ? "bg-background/70 backdrop-blur-md" : "bg-background";
  }
};
