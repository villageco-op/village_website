import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderSummaryCard } from './OrderSummaryCard';

const meta: Meta<typeof OrderSummaryCard> = {
  title: 'Orders/OrderDetails/OrderSummaryCard',
  component: OrderSummaryCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderSummaryCard>;

const baseOrder = {
  buyerId: 'buyer-123',
  sellerId: 'seller-456',
  buyer: { id: 'buyer-123', name: 'Jane Doe', email: 'jane@example.com' },
  seller: { id: 'seller-456', name: 'Green Valley Farm', email: 'farm@example.com' },
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Delivery: Story = {
  args: {
    order: {
      ...baseOrder,
      id: 'ord_123',
      status: 'pending',
      fulfillmentType: 'delivery',
      paymentMethod: 'card',
      totalAmount: '45.50',
      scheduledTime: new Date().toISOString(),
      cancelReason: null,
      stripeReceiptUrl: 'https://stripe.com/receipt',
    },
  },
};

export const Pickup: Story = {
  args: {
    order: {
      ...baseOrder,
      id: 'ord_124',
      status: 'completed',
      fulfillmentType: 'pickup',
      paymentMethod: 'snap',
      totalAmount: '12.00',
      scheduledTime: new Date().toISOString(),
      cancelReason: null,
      stripeReceiptUrl: 'https://stripe.com/receipt',
    },
  },
};

export const Canceled: Story = {
  args: {
    order: {
      ...baseOrder,
      id: 'ord_125',
      status: 'canceled',
      fulfillmentType: 'delivery',
      paymentMethod: 'card',
      totalAmount: '89.99',
      cancelReason: 'The delivery route is currently blocked by local road construction.',
      scheduledTime: new Date().toISOString(),
      stripeReceiptUrl: 'https://stripe.com/receipt',
    },
  },
};
