import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { UpcomingOrdersCard } from './UpcomingOrdersCard';

import {
  OrderStatusProperty,
  OrderPaymentMethod,
  OrderFulfillmentType,
} from '@/lib/api/generated/models';

const meta: Meta<typeof UpcomingOrdersCard> = {
  title: 'Buyer/Dashboard/UpcomingOrdersCard',
  component: UpcomingOrdersCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpcomingOrdersCard>;

const mockOrders = [
  {
    id: 'ORD-123',
    buyerId: 'buyer-1',
    sellerId: 'grower-alpha',
    paymentMethod: OrderPaymentMethod.card,
    fulfillmentType: OrderFulfillmentType.delivery,
    scheduledTime: new Date().toISOString(),
    status: OrderStatusProperty.pending,
    totalAmount: '145.50',
    cancelReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ORD-456',
    buyerId: 'buyer-1',
    sellerId: 'grower-beta',
    paymentMethod: OrderPaymentMethod.snap,
    fulfillmentType: OrderFulfillmentType.pickup,
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    status: OrderStatusProperty.completed,
    totalAmount: '62.00',
    cancelReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * View with multiple upcoming orders.
 */
export const Default: Story = {
  args: {
    orders: mockOrders,
  },
};

/**
 * View when no orders are scheduled for the week.
 */
export const Empty: Story = {
  args: {
    orders: [],
  },
};

/**
 * Mobile view to ensure the table scrolls or wraps correctly.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    orders: [mockOrders[0]],
  },
};
