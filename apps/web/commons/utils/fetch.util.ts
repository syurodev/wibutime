import { getSession } from '@/lib/session';
import { BaseResponse, PROJECT_ID } from '@workspace/commons';

export const fetchData = async <T>(init: {
  url: string;
  projectId: PROJECT_ID;
  params?: Record<string, any>;
  options?: {
    method?: 'GET' | 'POST';
    body?: any;
  };
}): Promise<BaseResponse<T>> => {
  const apiEndpoint: string = process.env.API_ENDPOINT ?? '';

  const { url, projectId, params, options } = init;

  try {
    let finalUrl = apiEndpoint + url;

    const session = await getSession();

    // Only append query params for GET requests or if params are provided for POST
    if ((!options?.method || options.method === 'GET') && params) {
      const queryString = new URLSearchParams(params).toString();
      finalUrl = `${apiEndpoint}${url}${
        url.includes('?') ? '&' : '?'
      }${queryString}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-project-id': projectId.toString(),
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(finalUrl, {
      method: options?.method ?? 'GET',
      headers: headers,
      ...(options?.body && { body: JSON.stringify(options.body) }),
      ...(options?.method === 'POST' &&
        params && { body: JSON.stringify(params) }),
    });

    const result = await response.json();
    return result as BaseResponse<T>;
  } catch (err) {
    throw err instanceof Error ? err : new Error('An error occurred');
  }
};
