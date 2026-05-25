import { type NextRequest } from 'next/server';

import type { User } from './generated/models/user';

/**
 * Fetches the current authenticated user's profile.
 * Designed to be used safely inside Next.js Edge Middleware.
 * @param request - The NextRequest
 * @returns The user or null
 */
export async function fetchCurrentUser(request: NextRequest): Promise<User | null> {
  const apiUrl = new URL('/api/users/me', request.url);
  const cookieHeader = request.headers.get('cookie');

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as User;
  } catch (error) {
    console.error('Error fetching current user in middleware:', error);
    return null;
  }
}
