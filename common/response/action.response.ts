/**
 * @param param0 object -> status?, message?, data?, apiResponse?
 * @returns object -> status, message, data -> type ServerActionResponse<T>
 */
export const serverActionResponse = <T>({
  status,
  message,
  data,
  apiResponse,
}: {
  status?: number;
  message?: string;
  data?: T;
  apiResponse?: ApiResponse<T>;
}): ServerActionResponse<T> => {
  if (apiResponse) return apiResponse;

  return {
    status: status ? status : !data ? 400 : 200,
    message: message ?? "SUCCESS",
    data: data ?? null,
  };
};
