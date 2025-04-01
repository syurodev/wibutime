import { PROJECT_ID } from '../constants/projectid.enum';
import { BaseResponse } from '../interfaces/base-response';

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

    // Only append query params for GET requests or if params are provided for POST
    if ((!options?.method || options.method === 'GET') && params) {
      const queryString = new URLSearchParams(params).toString();
      finalUrl = `${apiEndpoint}${url}${
        url.includes('?') ? '&' : '?'
      }${queryString}`;
    }

    const response = await fetch(finalUrl, {
      method: options?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-project-id': projectId.toString(),
        Authorization: `Bearer `,
      },
      ...(options?.body && { body: JSON.stringify(options.body) }),
      ...(options?.method === 'POST' &&
        params && { body: JSON.stringify(params) }),
    });

    // if (!response.ok) {
    //   throw new Error(`Error fetching data: ${response.statusText}`);
    // }
    const result = await response.json();
    console.log(result);
    return result as BaseResponse<T>;
  } catch (err) {
    throw err instanceof Error ? err : new Error('An error occurred');
  }
};
