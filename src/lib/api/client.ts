import { env } from '@/config/env';

export const apiClient = async <T>(url: string, options: RequestInit): Promise<T> => {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  let stagingKeyHeader: { 'X-Staging-Key': string | undefined } | undefined = undefined;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    stagingKeyHeader = { 'X-Staging-Key': process.env.NEXT_PUBLIC_STAGING_SECRET_KEY };
  }

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...stagingKeyHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown Error' }));
    throw new Error(error.error || 'Network response was not ok');
  }

  return response.json() as Promise<T>;
};
