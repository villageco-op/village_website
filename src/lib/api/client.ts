import { ApiError } from './types/ApiError';

export const apiClient = async <T>(url: string, options: RequestInit): Promise<T> => {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Unknown Error' }));

    throw new ApiError(response.status, errorBody);
  }

  const data = await response.json();

  return {
    data: data,
    status: response.status,
    headers: response.headers,
  } as T;
};
