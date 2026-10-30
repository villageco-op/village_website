import type { SubscriptionDetailResponse } from './generated/models';
import { serverFetch } from './server-fetch';

/**
 * Fetches a subscription by ID on the server side.
 * @param id The ID of the subscription
 * @returns An object containing the response status and subscription data
 */
export async function fetchSubscriptionById(
  id: string,
): Promise<SubscriptionDetailResponse | null> {
  return serverFetch<SubscriptionDetailResponse>(`/api/subscriptions/${id}`);
}
