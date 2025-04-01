export interface UserContentHistory {
  id: number;
  title: string;
  cover_image_url: string;
  last_seen_at: string;
  content: {
    id: number;
    index: number;
    title: string;
    status: number;
    bookmark_line: string;
  };
}
