import type { User } from './generated/models/user';
import { serverFetch } from './server-fetch';

/**
 * Fetches the current authenticated user's profile.
 * @param cookieHeader - The NextRequest cookie header
 * @returns The user or null
 */
export async function fetchCurrentUser(cookieHeader?: string | null): Promise<User | null> {
  return serverFetch<User>('/api/users/me', {}, cookieHeader);
}
