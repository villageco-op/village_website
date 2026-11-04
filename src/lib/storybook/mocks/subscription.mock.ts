import { BASE_MOCK_PRODUCE } from './produce.mock';
import { MOCK_BUYER_USER, MOCK_SELLER_USER } from './user.mock';

import {
  FulfillmentType,
  type SubscriptionDetailResponse,
  SubscriptionStatus,
} from '@/lib/api/generated/models';

/**
 * Complete default baseline SubscriptionDetailResponse mock object.
 */
export const BASE_MOCK_SUBSCRIPTION: SubscriptionDetailResponse = {
  id: 'sub-1',
  buyerId: MOCK_BUYER_USER.id,
  sellerId: MOCK_SELLER_USER.id,
  productId: BASE_MOCK_PRODUCE.id,
  quantityOz: '4',
  status: SubscriptionStatus.active,
  cancelReason: null,
  fulfillmentType: FulfillmentType.delivery,
  nextDeliveryDate: '2026-06-15T10:00:00Z',
  createdAt: '2026-01-15T08:00:00.000Z',
  updatedAt: '2026-05-01T12:00:00.000Z',
  product: BASE_MOCK_PRODUCE,
  buyer: {
    id: MOCK_BUYER_USER.id,
    name: MOCK_BUYER_USER.name,
    email: MOCK_BUYER_USER.email,
    organizationId: MOCK_BUYER_USER.organizationId || undefined,
    image: MOCK_BUYER_USER.image || undefined,
    location: {
      address: MOCK_BUYER_USER.address,
      city: MOCK_BUYER_USER.city,
      state: MOCK_BUYER_USER.state,
      country: MOCK_BUYER_USER.country,
      zip: MOCK_BUYER_USER.zip,
      lat: MOCK_BUYER_USER.lat,
      lng: MOCK_BUYER_USER.lng,
    },
  },
  seller: {
    id: MOCK_SELLER_USER.id,
    name: MOCK_SELLER_USER.name,
    email: MOCK_SELLER_USER.email,
    organizationId: MOCK_SELLER_USER.organizationId || undefined,
    image: MOCK_SELLER_USER.image || undefined,
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
