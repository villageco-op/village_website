import { logger } from '../logger';

import type { OrderDetailResponse } from './generated/models';

/**
 * Fetches an order by ID on the server side using cookie authentication.
 * @param id The ID of the order
 * @param cookieHeader The incoming cookie string from Next.js server context
 * @returns An object containing the response status and order data
 */
export async function fetchOrderById(
  id: string,
  cookieHeader: string | null,
): Promise<OrderDetailResponse | null> {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8080';
  const apiUrl = new URL(`/api/orders/${id}`, backendBase);

  try {
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        Host: apiUrl.host,
        'Content-Type': 'application/json',
      },
    });

    return (await res.json()) as OrderDetailResponse;
  } catch (error) {
    logger.error('Error fetching order by ID on server:', error);
    return null;
  }
}
