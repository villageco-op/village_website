'use client';

import { useState, useEffect } from 'react';

import type { User } from '@/lib/api/generated/models/user';

/**
 * Interface for a session with a user and the expiration.
 */
export interface Session {
  user?: User;
  expires: string;
}

/**
 * Hook for checking user auth status and retrieving the current user.
 * @returns An object containing the session, user, and status.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');

        if (!res.ok) {
          setStatus('unauthenticated');
          return;
        }

        const data = await res.json();

        // Auth.js returns an empty object {} if no session exists
        if (Object.keys(data).length > 0) {
          setSession(data);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to fetch auth session', error);
        setStatus('unauthenticated');
      }
    };

    void fetchSession();
  }, []);

  const logout = async () => {
    try {
      const csrfRes = await fetch('/api/auth/csrf');
      if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');

      const { csrfToken } = await csrfRes.json();

      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          csrfToken: csrfToken,
        }),
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return { session, user: session?.user, status, logout };
}
