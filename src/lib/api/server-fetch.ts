import { cookies, headers } from 'next/headers';

import { logger } from '../logger';

/**
 * Executes a server-side fetch to the backend API, automatically forwarding
 * authentication cookies and E2E database isolation headers.
 * @param endpoint - The target endpoint
 * @param options - Options object to include
 * @param cookieHeaderOverride - Optional cookie header override
 * @returns The fetch response
 */
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  cookieHeaderOverride?: string | null,
): Promise<T | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL(endpoint, backendBase);

  try {
    const incomingHeaders = await headers();
    const e2eDbUrl = incomingHeaders.get('x-e2e-neon-db-url');

    let cookieHeader = cookieHeaderOverride;
    if (cookieHeader === undefined) {
      try {
        const cookieStore = await cookies();
        cookieHeader = cookieStore.toString();
      } catch {
        cookieHeader = null;
      }
    }

    const res = await fetch(apiUrl.toString(), {
      ...options,
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(e2eDbUrl ? { 'x-e2e-neon-db-url': e2eDbUrl } : {}),
        Host: apiUrl.host,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      logger.warn('Server fetch returned non-ok status', { status: res.status, endpoint });
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    logger.error('Error executing server-side fetch', { error, endpoint });
    return null;
  }
}
