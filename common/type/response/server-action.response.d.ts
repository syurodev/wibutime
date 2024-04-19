type ServerActionResponse<T> = {
  status: number;
  message: string;
  data: T | null;
};
