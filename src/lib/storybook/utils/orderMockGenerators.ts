import {
  BASE_MOCK_ORDER,
  BASE_MOCK_ORDER_DETAIL,
  BASE_MOCK_ORDER_ITEM,
  BASE_MOCK_ORDER_LIST_ITEM,
  BASE_MOCK_ORDER_LIST_ITEM_PRODUCE,
  BASE_MOCK_PRODUCE_ORDER_BUYER,
  BASE_MOCK_PRODUCE_ORDER_LIST_ITEM,
} from '../mocks/order.mock';

import type {
  OrderDetailResponse,
  OrderItemDetails,
  OrderListItem,
  OrderSummary,
  ProduceOrderListItem,
} from '@/lib/api/generated/models';
import { OrderStatusProperty } from '@/lib/api/generated/models';

/**
 * Creates a single mock OrderListItem entity with optional overrides.
 * @template T - A partial type of OrderListItem for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed OrderListItem mock object.
 */
export const createMockOrderListItem = <T extends Partial<OrderListItem>>(
  overrides?: T,
): OrderListItem => ({
  ...BASE_MOCK_ORDER_LIST_ITEM,
  ...overrides,
});

/**
 * Generates an array of mock OrderListItem items with dynamic IDs, titles, and distances.
 * @param count - The number of mock list items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each item.
 * @returns An array of generated OrderListItem mock objects.
 */
export const generateMockOrderListItems = (
  count: number,
  overridesFn?: (index: number) => Partial<OrderListItem>,
): OrderListItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const item: OrderListItem = {
      ...BASE_MOCK_ORDER_LIST_ITEM,
      id: `item-${i + 1}`,
      productId: `prod-101-${i + 1}`,
      quantityOz: '16.00',
      pricePerOz: '2.50',
      product: {
        ...BASE_MOCK_ORDER_LIST_ITEM_PRODUCE,
        id: `prod-101-${i + 1}`,
        title: `Produce Batch #${i + 1}`,
        distance: Number((1.2 + i * 0.8).toFixed(1)),
      },
      ...(overridesFn ? overridesFn(i) : {}),
    };

    return item;
  });
};

/**
 * Generates an array of mock OrderSummary items with customizable prefixes, statuses, and seller info.
 * @param count - The number of mock orders to generate.
 * @param prefix - String prefix used for generating order and product IDs (defaults to 'ORD').
 * @param status - The initial order status property (defaults to OrderStatusProperty.pending).
 * @param overridesFn - Optional callback function providing index-based overrides for each order summary.
 * @returns An array of generated OrderSummary mock objects.
 */
export const generateMockOrders = (
  count: number,
  prefix: string = 'ORD',
  status: string = OrderStatusProperty.pending,
  overridesFn?: (index: number) => Partial<OrderSummary>,
): OrderSummary[] => {
  const isPending = prefix.toLowerCase().includes('pend');

  return Array.from({ length: count }, (_, i) => {
    const sellerId = i % 2 === 0 ? 'grower-alpha' : 'grower-beta';
    const sellerName = i % 2 === 0 ? 'Alpha Farm Co.' : 'Beta Organics';
    const itemPrefix = isPending ? 'Pending Produce Batch' : 'History Crate Item';

    const mockOrder: OrderSummary = {
      ...BASE_MOCK_ORDER,
      id: `${prefix}-${7000 + i}`,
      status: status as OrderStatusProperty,
      sellerId,
      seller: {
        ...BASE_MOCK_ORDER.seller,
        id: sellerId,
        name: sellerName,
      },
      counterparty: {
        ...BASE_MOCK_ORDER.counterparty,
        id: sellerId,
        name: sellerName,
      },
      totalAmount: (10 + i).toFixed(2),
      items: [
        {
          id: `item-${prefix}-${i + 1}`,
          productId: `prod-${prefix}-${i + 1}`,
          quantityOz: '16.00',
          pricePerOz: '2.50',
          product: {
            id: `prod-${prefix}-${i + 1}`,
            title: `${itemPrefix} #${i + 1}-`,
            distance: 1.2 + i,
            type: 'Produce',
            images: [],
          },
        },
      ],
      ...(overridesFn ? overridesFn(i) : {}),
    };

    return mockOrder;
  });
};

/**
 * Creates a single mock OrderItemDetails entity with optional overrides.
 * @template T - A partial type of OrderItemDetails for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed OrderItemDetails mock object.
 */
export const createMockOrderItem = <T extends Partial<OrderItemDetails>>(
  overrides?: T,
): OrderItemDetails => ({
  ...BASE_MOCK_ORDER_ITEM,
  ...overrides,
});

/**
 * Generates an array of mock OrderItemDetails items with distinct names and prices rotated from sample products.
 * @param count - The number of order items to generate.
 * @param overridesFn - Optional callback function providing index-based overrides for each order item.
 * @returns An array of generated OrderItemDetails mock objects.
 */
export const generateMockOrderItems = (
  count: number,
  overridesFn?: (index: number) => Partial<OrderItemDetails>,
): OrderItemDetails[] => {
  const sampleProducts = [
    { name: 'Heirloom Tomatoes', quantityOz: '32', pricePerOz: '0.25' },
    { name: 'Honey Crisp Apples', quantityOz: '80', pricePerOz: '0.1875' },
    { name: 'Fresh Kale', quantityOz: '16', pricePerOz: '0.3125' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const sample = sampleProducts[i % sampleProducts.length];

    return createMockOrderItem({
      id: `item-${i + 1}`,
      productId: `prod-${i + 1}`,
      productName: sample.name,
      quantityOz: sample.quantityOz,
      pricePerOz: sample.pricePerOz,
      ...(overridesFn ? overridesFn(i) : {}),
    });
  });
};

/**
 * Creates a single mock OrderDetailResponse entity extended with custom partial properties.
 * @template T - A partial type of OrderDetailResponse for custom properties.
 * @param overrides - Optional properties to override default mock values.
 * @returns A fully constructed OrderDetailResponse mock object.
 */
export const createMockOrderDetail = <T extends Partial<OrderDetailResponse>>(
  overrides?: T,
): OrderDetailResponse => ({
  ...BASE_MOCK_ORDER_DETAIL,
  ...overrides,
});

/**
 * Generates an array of mock OrderDetailResponse items with full details,
 * locations, and items.
 * @param count - The number of detailed orders to generate.
 * @param prefix - String prefix used for generating order IDs (defaults to 'ORD').
 * @param status - The OrderStatusProperty status of the detailed orders (defaults to OrderStatusProperty.pending).
 * @param overridesFn - Optional callback function providing index-based overrides for each order detail.
 * @returns An array of generated OrderDetailResponse mock objects.
 */
export const generateMockOrderDetails = (
  count: number,
  prefix: string = 'ORD',
  status: OrderStatusProperty = OrderStatusProperty.pending,
  overridesFn?: (index: number) => Partial<OrderDetailResponse>,
): OrderDetailResponse[] => {
  const isPending = prefix.toLowerCase().includes('pend');

  return Array.from({ length: count }, (_, i) => {
    const sellerId = i % 2 === 0 ? 'grower-alpha' : 'grower-beta';
    const sellerName = i % 2 === 0 ? 'Alpha Farm Co.' : 'Beta Organics';
    const itemPrefix = isPending ? 'Pending Produce Batch' : 'History Crate Item';

    const mockOrderDetail: OrderDetailResponse = {
      ...BASE_MOCK_ORDER_DETAIL,
      id: `${prefix}-${7000 + i}`,
      status: status,
      sellerId,
      seller: {
        ...BASE_MOCK_ORDER_DETAIL.seller,
        id: sellerId,
        name: sellerName,
      },
      totalAmount: (10 + i).toFixed(2),
      items: [
        createMockOrderItem({
          id: `item-${prefix}-${i + 1}`,
          productId: `prod-${prefix}-${i + 1}`,
          productName: `${itemPrefix} #${i + 1}`,
          quantityOz: '16.00',
          pricePerOz: '2.50',
        }),
      ],
      ...(overridesFn ? overridesFn(i) : {}),
    };

    return mockOrderDetail;
  });
};

/**
 * Generates an array of mock ProduceOrderListItem items for listing order views.
 * @param count The number of mock produce orders to generate.
 * @param overridesFn Optional callback function providing index-based overrides for each item.
 * @returns An array of generated ProduceOrderListItem mock objects.
 */
export const generateMockProduceOrderListItems = (
  count: number,
  overridesFn?: (index: number) => Partial<ProduceOrderListItem>,
): ProduceOrderListItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const item: ProduceOrderListItem = {
      ...BASE_MOCK_PRODUCE_ORDER_LIST_ITEM,
      id: `prod_order_${i + 1}`,
      totalAmount: (10 + i * 2).toFixed(2),
      quantityOz: '16.00',
      buyer: {
        ...BASE_MOCK_PRODUCE_ORDER_BUYER,
        id: `usr_${i + 1}`,
        name: `Buyer ${i + 1}`,
      },
      ...(overridesFn ? overridesFn(i) : {}),
    };

    return item;
  });
};
