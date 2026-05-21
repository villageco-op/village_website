import type { NextRequest } from 'next/server';

/**
 * Checks if the Auth.js session cookie exists in the incoming request.
 * @param request - The next request
 * @returns True is the session token cookie exists
 */
export function hasSessionToken(request: NextRequest): boolean {
  const secureToken = request.cookies.get('__Secure-authjs.session-token');
  const devToken = request.cookies.get('authjs.session-token');

  return !!(secureToken || devToken);
}
