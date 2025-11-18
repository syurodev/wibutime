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

/**
 * Get progress bar gradient colors based on content type
 * Returns Tailwind gradient classes matching the content type badge colors
 */
export const getContentProgressGradient = (type: CONTENT_TYPE): string => {
  switch (type) {
    case CONTENT_TYPE.ANIME:
      return "from-cyan-500 to-cyan-600"; // Match cyan badge
    case CONTENT_TYPE.MANGA:
      return "from-purple-500 to-purple-600"; // Match purple badge
    case CONTENT_TYPE.NOVEL:
      return "from-teal-500 to-teal-600"; // Match teal badge
    default:
      return "from-primary to-primary";
  }
};

/**
 * Get badge variant based on content type
 * Use with Badge component: <Badge variant={getContentBadgeVariant(type)} />
 */
export const getContentBadgeVariant = (
  type: CONTENT_TYPE,
  blur = true
): "anime" | "manga" | "novel" | "anime-solid" | "manga-solid" | "novel-solid" => {
  if (blur) {
    switch (type) {
      case CONTENT_TYPE.ANIME:
        return "anime";
      case CONTENT_TYPE.MANGA:
        return "manga";
      case CONTENT_TYPE.NOVEL:
        return "novel";
      default:
        return "anime";
    }
  } else {
    switch (type) {
      case CONTENT_TYPE.ANIME:
        return "anime-solid";
      case CONTENT_TYPE.MANGA:
        return "manga-solid";
      case CONTENT_TYPE.NOVEL:
        return "novel-solid";
      default:
        return "anime-solid";
    }
  }
};
