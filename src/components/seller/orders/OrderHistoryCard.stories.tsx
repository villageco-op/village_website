import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderHistoryCard } from './OrderHistoryCard';

const meta: Meta<typeof OrderHistoryCard> = {
  title: 'Components/Seller/Orders/OrderHistoryCard',
  component: OrderHistoryCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderHistoryCard>;

/**
 * A standard view of the order history with multiple fulfilled orders.
 */
export const Default: Story = {
  args: {
    completedCount: 3,
    orders: [
      {
        id: 'ord_1234567890abcdef',
        totalAmount: '45.50',
        fulfillmentType: 'pickup',
        scheduledTime: new Date().toISOString(),
        status: 'completed',
        sellerId: 'seller-1',
        buyerId: 'buyer-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
      },
      {
        id: 'ord_9876543210fedcba',
        totalAmount: '12.00',
        fulfillmentType: 'delivery',
        scheduledTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: 'canceled',
        sellerId: 'seller-1',
        buyerId: 'buyer-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
      },
      {
        id: 'ord_4567891230jklmno',
        totalAmount: '88.25',
        fulfillmentType: 'pickup',
        scheduledTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'completed',
        sellerId: 'seller-1',
        buyerId: 'buyer-3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
      },
    ],
  },
};

/**
 * State when the seller has no historical data for the last 30 days.
 */
export const EmptyState: Story = {
  args: {
    completedCount: 0,
    orders: [],
  },
};

/**
 * Testing the card's responsiveness with many rows.
 */
export const LongHistory: Story = {
  args: {
    completedCount: 15,
    orders: Array.from({ length: 10 }).map((_, i) => ({
      id: `ord_long_${i}`,
      totalAmount: (Math.random() * 100).toFixed(2),
      fulfillmentType: i % 2 === 0 ? 'pickup' : 'delivery',
      scheduledTime: new Date(Date.now() - i * 86400000).toISOString(),
      status: 'completed',
      sellerId: 'seller-1',
      buyerId: `buyer-${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod: 'card',
      cancelReason: null,
    })),
  },
};

/**
 * Mobile view to check table overflow and text truncation.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
