import { EditorContent } from 'src/common/interfaces/editor';

export interface AuthorOrArtist {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Chapter {
  id: number;
  index: number;
  title: string;
  status: number;
  created_at: string;
}

export interface Volume {
  id: number;
  title: string;
  chapters: Chapter[];
  release_date: string | null;
  volume_number: number;
  word_count: number;
  cover_image_url: string;
  synopsis: string;
}

export interface SPNovelDetail {
  id: number;
  type: number;
  title: string;
  artist: AuthorOrArtist;
  author: AuthorOrArtist;
  genres: Genre[];
  status: number;
  summary: EditorContent[];
  volumes: Volume[];
  word_count: number;
  cover_image_url: string;
  alternative_names: string[];
}
