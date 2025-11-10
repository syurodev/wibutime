import { CONTENT_TYPE } from "../constants/default";

type IGetContentBg = {
  readonly type: CONTENT_TYPE;
  blur?: boolean;
};

export const getContentBg = ({ type, blur = false }: IGetContentBg) => {
  switch (type) {
    case CONTENT_TYPE.ANIME:
      return blur ? "bg-pink-500/50 backdrop-blur-md" : "bg-pink-500";
    case CONTENT_TYPE.MANGA:
      return blur ? "bg-amber-400/50 backdrop-blur-md" : "bg-amber-400";
    case CONTENT_TYPE.NOVEL:
      return blur ? "bg-teal-500/50 backdrop-blur-md" : "bg-teal-500";
    default:
      return blur ? "bg-background/50 backdrop-blur-md" : "bg-background";
  }
};
