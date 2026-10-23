import { logger } from '../logger';

import type { SubscriptionDetailResponse } from './generated/models';

/**
 * Fetches a subscription by ID on the server side using cookie authentication.
 * @param id The ID of the subscription
 * @param cookieHeader The incoming cookie string from Next.js server context
 * @returns An object containing the response status and subscription data
 */
export async function fetchSubscriptionById(
  id: string,
  cookieHeader: string | null,
): Promise<SubscriptionDetailResponse | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL(`/api/subscriptions/${id}`, backendBase);

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        Host: apiUrl.host,
        'Content-Type': 'application/json',
      },
    });

    return (await res.json()) as SubscriptionDetailResponse;
  } catch (error) {
    logger.error('Error fetching subscription by ID on server:', error);
    return null;
  }
}
