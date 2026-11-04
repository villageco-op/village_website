import { BASE_MOCK_PRODUCE_LIST_ITEM, MOCK_PRODUCE_LISTING } from '../mocks/produce.mock';
import { MOCK_SELLER_USER } from '../mocks/user.mock';

import type { ProduceListItem, SellerProduceListing } from '@/lib/api/generated/models';

/**
 * Creates a single mock ProduceListItem entity with optional overrides.
 * @template T - A partial type of ProduceListItem for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed ProduceListItem mock object.
 */
export const createMockProduceListItem = <T extends Partial<ProduceListItem>>(
  overrides?: T,
): ProduceListItem => ({
  ...BASE_MOCK_PRODUCE_LIST_ITEM,
  ...overrides,
});

/**
 * Generates an array of mock ProduceListItem objects with distinct names, sellers, and pricing.
 * @param count - The number of mock ProduceListItem items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated ProduceListItem mock objects.
 */
export const generateMockProduceListItems = (
  count: number,
  overridesFn?: (index: number) => Partial<ProduceListItem>,
): ProduceListItem[] => {
  const sampleProduce = [
    { name: 'Fresh Organic Microgreens', price: '$2.50/oz', amount: '100 oz', distance: 1.2 },
    { name: 'Heirloom Tomatoes', price: '$0.25/oz', amount: '80 oz', distance: 2.8 },
    { name: 'Crisp Hydroponic Lettuce', price: '$0.50/oz', amount: '50 oz', distance: 3.5 },
    { name: 'Fresh Pea Shoots', price: '$1.75/oz', amount: '60 oz', distance: 0.9 },
  ];

  return Array.from({ length: count }, (_, i) => {
    const sample = sampleProduce[i % sampleProduce.length];
    const sellerId = i % 2 === 0 ? MOCK_SELLER_USER.id : 'usr_456';
    const sellerName = i % 2 === 0 ? MOCK_SELLER_USER.name : 'Green Valley Farm';

    const item: ProduceListItem = createMockProduceListItem({
      id: `prod_${i + 1}`,
      name: `${sample.name} #${i + 1}`,
      sellerId,
      sellerName,
      price: sample.price,
      amount: sample.amount,
      distance: sample.distance + i * 0.5,
      isSubscribable: i % 2 === 0,
      ...(overridesFn ? overridesFn(i) : {}),
    });

    return item;
  });
};

/**
 * Generates an array of mock produce listings.
 * @param count - The number of mock  produce listings to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each listing.
 * @returns An array of generated SellerProduceListing objects.
 */
export const generateMockListings = (
  count: number,
  overridesFn?: (index: number) => Partial<SellerProduceListing>,
): SellerProduceListing[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...MOCK_PRODUCE_LISTING,
    id: `list_${i + 1}`,
    title: `Listing Item ${i + 1}`,
    description: `Listing Item ${i + 1} description.`,
    ...(overridesFn ? overridesFn(i) : {}),
  }));
};
