import { env } from '@/config/env';

export const apiClient = async <T>(url: string, options: RequestInit): Promise<T> => {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const formattedUrl = url.startsWith('/') ? url : `/${url}`;

  const response = await fetch(`${baseUrl}${formattedUrl}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown Error' }));
    throw new Error(error.error || 'Network response was not ok');
  }

  return response.json() as Promise<T>;
};
