import type { OrderDetailResponse } from './generated/models';
import { serverFetch } from './server-fetch';

/**
 * Fetches an order by ID on the server side.
 * @param id The ID of the order
 * @returns An object containing the response status and order data
 */
export async function fetchOrderById(id: string): Promise<OrderDetailResponse | null> {
  return serverFetch<OrderDetailResponse>(`/api/orders/${id}`);
}
