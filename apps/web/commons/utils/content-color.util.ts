import { CONTENT_TYPE } from "../constants/content-type.enum";

export class ContentColorUtil {
  private readonly colorMap = {
    [CONTENT_TYPE.ANIME]: "anime",
    [CONTENT_TYPE.MANGA]: "manga",
    [CONTENT_TYPE.NOVEL]: "novel",
  };

  constructor(private contentType: CONTENT_TYPE) {}

  public getBorderColor = (direction?: "top" | "left" | "bottom" | "right") => {
    const baseColor = this.colorMap[this.contentType] || "novel";
    const prefix = direction ? `border-${direction[0]}-` : "border-";
    return `${prefix}${baseColor}-color`;
  };

  public getTextColor = () => {
    const baseColor = this.colorMap[this.contentType] || "novel";
    return `text-${baseColor}-color`;
  };
}
