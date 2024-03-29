type DetailData = {
  id: string;
  name: string;
  producer: string;
  releaseDate: string;
  author?: string;
  artist?: string;
  view: number;
  favorites: any[];
  categories: string[];
  description: string;
  type: "anime" | "manga" | "lightnovel";
  music: {
    title: string;
    name: string;
    link: string;
  }[];

  duration: number;
  eps?: {
    id: string,
    url: string
  }[];
  volumes: LightnovelVolumeDetail[],
  mangachaps?: {
    id: string,
    image: {
      key?: string
      url: string
    }[]
  }[],
  current?: number;
  end?: number;
  history?: {
    title: string,
    url: string
  };
  image?: {
    key?: string
    url: string
  } | null
  thumbnail?: {
    key?: string
    url: string
  } | null;
  auth: {
    id: string;
    image: {
      key?: string
      url: string
    } | string | null;
    name: string;
  }
}

type Category = {
  id: string,
  name: string
}

type ContentType = "anime" | "manga" | "lightnovel"

type ContentStatus = "Pause" | "Complete" | "InProcess"

type DaysOfTheWeek = "Sun" | "Mon" | "Tues" | "Wed" | "Thurs" | "Fri" | "Sat"

type MusicType = "Opening Theme" | "Ending Theme" | "OST"

type ContextMenu = "anime" | "anime season" | "lightnovel" | "lightnovel volume" | "manga" | "manga season"

type CommentType = "anime" | "anime ep" | "manga" | "manga chapter" | "lightnovel" | "lightnovel chapter"

type CommentData = {
  id: string,
  comment: string,
  createdAt: Date,
  favoriteNumber: string,
  isFavorite: boolean,
  uncomplete?: boolean,
  user: {
    id: string,
    name: string,
    image?: string
  }
  replies?: {
    id: string,
    comment: string,
    favoriteNumber: string,
    isFavorite: boolean,
    createdAt: Date,
    user: {
      id: string,
      name: string,
      image?: string,
    }
  }[]
}