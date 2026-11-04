import { MOCK_SELLER_USER } from './user.mock';

import { ProduceStatus, ProduceType } from '@/lib/api/generated/models';
import type {
  ProduceDetails,
  ProduceListItem,
  SellerProduceListing,
  Produce,
} from '@/lib/api/generated/models';

/**
 * Baseline default Produce mock object.
 */
export const BASE_MOCK_PRODUCE: Produce = {
  id: 'prod_123',
  sellerId: 'usr_789',
  title: 'Fresh Organic Microgreens',
  description: 'Locally grown, nutrient-dense fresh microgreens harvested daily.',
  produceType: ProduceType.leafy_greens,
  pricePerOz: '2.50',
  totalOzInventory: '100',
  maxOrderQuantityOz: '16',
  availableBy: '2026-06-01T08:00:00Z',
  harvestFrequencyDays: 7,
  seasonStart: '2026-05-01T00:00:00Z',
  seasonEnd: '2026-11-01T00:00:00Z',
  images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999'],
  isSubscribable: true,
  status: ProduceStatus.active,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Produce details mock for produce details response.
 */
export const MOCK_PRODUCE_DETAILS: ProduceDetails = {
  ...BASE_MOCK_PRODUCE,
  seller: {
    id: MOCK_SELLER_USER.id,
    name: MOCK_SELLER_USER.name,
    image: MOCK_SELLER_USER.image || '',
    deliveryRangeMiles: Number(MOCK_SELLER_USER.deliveryRangeMiles) || 0,
    location: {
      address: MOCK_SELLER_USER.address,
      city: MOCK_SELLER_USER.city,
      state: MOCK_SELLER_USER.state,
      country: MOCK_SELLER_USER.country,
      zip: MOCK_SELLER_USER.zip,
      lat: MOCK_SELLER_USER.lat,
      lng: MOCK_SELLER_USER.lng,
    },
  },
};

/**
 * Mock produce listing with analytics.
 */
export const MOCK_PRODUCE_LISTING: SellerProduceListing = {
  ...BASE_MOCK_PRODUCE,
  analytics: {
    totalOzSold: 160,
    totalMonthlyEarnings: 120.0,
    numberOfSubscriptions: 8,
    numberOfOrders: 15,
    percentSold: 50,
    upcomingSubscriptionOzNeeded: 32,
    availableInventory: 160,
    inventorySufficientForUpcoming: true,
    nextHarvestDate: new Date().toISOString(),
  },
};

/**
 * Baseline default ProduceListItem mock object.
 */
export const BASE_MOCK_PRODUCE_LIST_ITEM: ProduceListItem = {
  id: BASE_MOCK_PRODUCE.id,
  thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
  name: BASE_MOCK_PRODUCE.title,
  sellerName: MOCK_SELLER_USER.name,
  sellerId: MOCK_SELLER_USER.id,
  price: `$${BASE_MOCK_PRODUCE.pricePerOz}/oz`,
  amount: `${BASE_MOCK_PRODUCE.totalOzInventory} oz`,
  availableBy: BASE_MOCK_PRODUCE.availableBy,
  distance: 2.5,
  isSubscribable: BASE_MOCK_PRODUCE.isSubscribable,
  description: BASE_MOCK_PRODUCE.description,
};
