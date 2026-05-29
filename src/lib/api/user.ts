import { type NextRequest } from 'next/server';

import type { User } from './generated/models/user';

/**
 * Fetches the current authenticated user's profile.
 * Designed to be used safely inside Next.js Edge Middleware.
 * @param request - The NextRequest
 * @returns The user or null
 */
export async function fetchCurrentUser(request: NextRequest): Promise<User | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL('/api/users/me', backendBase);

  const cookieHeader = request.headers.get('cookie');

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        Host: apiUrl.host,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Fetch current user failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data as User;
  } catch (error) {
    console.error('Error fetching current user in middleware:', error);
    return null;
  }
}
