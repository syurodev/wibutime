type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type ApiNoDataResponse = {
  result: boolean;
};
