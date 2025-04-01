import { AuthorOrArtist } from "../author-or-artist";
import { EditorContent } from "../editor-content";
import { Genre } from "../genre";

export interface ITopNovel {
  id: number;
  type: CONTENT_TYPE;
  title: string;
  cover_image_url: string;
  latest_chapter_date: string;
  views: number;
  average_score: number;
  vote_count: number;
  author: AuthorOrArtist;
  artist: AuthorOrArtist;
  genres: Genre[];
  summary: EditorContent[];
  content: {
    id: number;
    index: number;
    title: string;
    created_at: string;
  } | null;
}
