type New = {
  id: string;
  url_id: string;
  name: string;
  summary: string;
  current: string;
  type: ContentType;
  categories: {
    id: string;
    name: string;
  }[];
  image: string;
};
