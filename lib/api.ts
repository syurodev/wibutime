const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  console.log(res)

  if (!res.ok) {
    let errorMessage = ""
    try {
      const errorData = await res.json()
      if (errorData && errorData.message) {
        errorMessage = errorData.message
      }
      console.log(errorData)
      console.log(errorMessage)
    } catch (e) {
      // Ignore json parse error
    }
    console.log(1)
    throw new Error(errorMessage)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
}
