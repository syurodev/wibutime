export interface SpUserHistory {
  id: number;
  title: string;
  cover_image_url: string;
  last_read_at: string;
  chapter: {
    id: number;
    index: number;
    title: string;
    status: number;
    bookmark_line: string;
  };
}
