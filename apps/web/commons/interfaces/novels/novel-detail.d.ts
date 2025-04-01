import { AuthorOrArtist } from "../author-or-artist";
import { EditorContent } from "../editor-content";
import { Genre } from "../genre";
import { VolumeSummary } from "./volume-summary";

export interface INovelDetail {
  id: number;
  title: string;
  cover_image_url: string;
  summary: EditorContent[];
  author: AuthorOrArtist;
  artist: AuthorOrArtist;
  status: number;
  genres: Genre[];
  type: number;
  alternative_names: string[];
  word_count: number;
  volumes: VolumeSummary[];
  user: any;
}
