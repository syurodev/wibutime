import { RouteName } from "@/hooks/use-route-name";
import {
  Book,
  GalleryVerticalEnd,
  Heart,
  History,
  House,
  LucideIcon,
  MessageSquare,
  Search,
  Videotape,
} from "lucide-react";

export interface Tab {
  title: string;
  key: RouteName;
  func?: ITabFunc;
  href?: string;
  icon?: LucideIcon;
  type?: never;
}

export type ITabFunc = "FAVORITE" | "HISTORY" | "COMMENT";

export const TABS: Tab[] = [
  {
    title: "Home",
    key: "HOME",
    icon: House,
    href: "/",
  },
  {
    title: "Animes",
    key: "ANIME",
    icon: Videotape,
  },
  {
    title: "Mangas",
    key: "MANGA",
    icon: GalleryVerticalEnd,
  },
  {
    title: "Lightnovels",
    key: "NOVELS",
    icon: Book,
    href: "/novels",
  },
  {
    title: "Search",
    key: "SEARCH",
    icon: Search,
  },
];

export const NOVEL_TABS: Tab[] = [
  {
    title: "History",
    key: "NOVEL_DETAIL",
    func: "HISTORY",
    icon: History,
  },
  {
    title: "Favorite",
    func: "FAVORITE",
    key: "NOVEL_DETAIL",
    icon: Heart,
  },
  {
    title: "Comment",
    func: "COMMENT",
    key: "NOVEL_DETAIL",
    icon: MessageSquare,
  },
];
