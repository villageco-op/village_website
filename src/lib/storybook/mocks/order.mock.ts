import {
  OrderPaymentMethod,
  OrderFulfillmentType,
  OrderStatusProperty,
  ProduceStatus,
} from '@/lib/api/generated/models';
import type {
  OrderSummary,
  OrderDetailResponse,
  OrderItemDetails,
  OrderListItem,
  OrderListItemProduce,
  ProduceOrderBuyer,
  ProduceOrderListItem,
} from '@/lib/api/generated/models';

export const BASE_MOCK_ORDER_LIST_ITEM_PRODUCE: OrderListItemProduce = {
  id: 'prod-101',
  title: 'Fresh Organic Spinach',
  distance: 2.5,
  type: 'Produce',
  images: [],
};

export const BASE_MOCK_ORDER_LIST_ITEM: OrderListItem = {
  id: 'item-1',
  productId: 'prod-101',
  quantityOz: '16.00',
  pricePerOz: '2.81',
  product: BASE_MOCK_ORDER_LIST_ITEM_PRODUCE,
};

export const BASE_MOCK_ORDER_ITEM: OrderItemDetails = {
  id: 'item_1',
  productId: 'p1',
  productName: 'Organic Carrots',
  quantityOz: '48', // 3 lbs
  pricePerOz: '0.125', // $2.00/lb
  maxOrderQuantityOz: null,
  isProduceSubscribable: true,
  produceAvailableBy: '2026-05-10T09:30:00Z',
  produceStatus: ProduceStatus.active,
  produceSeasonStart: '2026-04-01',
  produceSeasonEnd: '2026-11-01',
  produceTotalOzInventory: '20.00',
  images: ['https://fakeimage.jpg'],
};

export const BASE_MOCK_ORDER: OrderSummary = {
  id: 'ORD-7000',
  buyerId: 'usr_789',
  sellerId: 'grower-alpha',
  paymentMethod: OrderPaymentMethod.card,
  fulfillmentType: OrderFulfillmentType.delivery,
  scheduledTime: '2026-06-15T10:00:00Z',
  status: OrderStatusProperty.pending,
  totalAmount: '45.00',
  createdAt: '2026-01-01T00:00:00.000Z',
  stripeReceiptUrl: null,
  stripeInvoiceId: null,
  cancelReason: null,
  updatedAt: null,
  buyer: {
    id: 'usr_789',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
  seller: {
    id: 'grower-alpha',
    name: 'Alpha Farm Co.',
    email: 'contact@alphafarm.com',
  },
  counterparty: {
    id: 'grower-alpha',
    name: 'Alpha Farm Co.',
    email: 'contact@alphafarm.com',
  },
  items: [BASE_MOCK_ORDER_LIST_ITEM],
};

export const BASE_MOCK_ORDER_DETAIL: OrderDetailResponse = {
  ...BASE_MOCK_ORDER,
  buyer: {
    ...BASE_MOCK_ORDER.buyer,
    location: {
      address: '742 Evergreen Terrace',
      lat: 41.5934,
      lng: -87.3464,
      city: 'Springfield',
      state: 'KY',
      country: 'United States',
      zip: '45638',
    },
  },
  seller: {
    ...BASE_MOCK_ORDER.seller,
    location: {
      address: '123 Farm Road',
      lat: 41.6,
      lng: -87.35,
      city: 'Springfield',
      state: 'KY',
      country: 'United States',
      zip: '45638',
    },
  },
  items: [BASE_MOCK_ORDER_ITEM],
};

export const BASE_MOCK_PRODUCE_ORDER_BUYER: ProduceOrderBuyer = {
  id: 'usr_789',
  name: 'Jane Doe',
  image: '',
};

export const BASE_MOCK_PRODUCE_ORDER_LIST_ITEM: ProduceOrderListItem = {
  id: 'prod_order_123',
  status: 'pending',
  fulfillmentType: 'delivery',
  scheduledTime: '2026-06-15',
  totalAmount: '45.00',
  quantityOz: '16.00',
  createdAt: '2026-01-01T00:00:00.000Z',
  buyer: BASE_MOCK_PRODUCE_ORDER_BUYER,
};
