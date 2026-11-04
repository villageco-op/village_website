import { BASE_MOCK_SUBSCRIPTION } from '../mocks/subscription.mock';

import { SubscriptionStatus } from '@/lib/api/generated/models';

/**
 * Generates an array of mock Subscription items.
 * @param count - The number of mock Subscription items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated Subscription mock objects.
 */
export const generateMockSubscriptions = (
  count: number,
  overridesFn?: (index: number) => Partial<typeof BASE_MOCK_SUBSCRIPTION>,
) => {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_MOCK_SUBSCRIPTION,
    id: `sub-${i + 1}`,
    quantityOz: (i + 4).toString(),
    status: i % 3 === 0 ? SubscriptionStatus.paused : SubscriptionStatus.active,
    fulfillmentType: i % 2 === 0 ? 'delivery' : 'pickup',
    product: { ...BASE_MOCK_SUBSCRIPTION.product, title: `Premium Produce ${i + 1}` },
    seller: { ...BASE_MOCK_SUBSCRIPTION.seller, name: `Farmer ${i + 1}`, id: `seller_${i + 1}` },
    buyer: { ...BASE_MOCK_SUBSCRIPTION.buyer, name: `Neighbor ${i + 1}`, id: `buyer_${i + 1}` },
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
