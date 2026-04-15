import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListingOrdersTable } from './ListingOrdersTable';

const meta: Meta<typeof ListingOrdersTable> = {
  title: 'Seller/ListingOrders/ListingOrdersTable',
  component: ListingOrdersTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListingOrdersTable>;

const mockOrders = [
  {
    id: 'ord_5f3a2b1c9d8e',
    buyer: {
      name: 'Jane Doe',
      image: 'https://i.pravatar.cc/150?u=jane',
    },
    quantityOz: 32, // 2 lbs
    totalAmount: '24.50',
    fulfillmentType: 'delivery',
    scheduledTime: new Date().toISOString(),
    status: 'completed',
  },
  {
    id: 'ord_1a2b3c4d5e6f',
    buyer: {
      name: 'Farmer Bob',
      image: '',
    },
    quantityOz: 80, // 5 lbs
    totalAmount: '50.00',
    fulfillmentType: 'pickup',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
  },
  {
    id: 'ord_9z8y7x6w5v4u',
    buyer: {
      name: 'Very Long Name That Might Truncate in the Table Cell',
      image: 'https://i.pravatar.cc/150?u=long',
    },
    quantityOz: 16, // 1 lb
    totalAmount: '12.00',
    fulfillmentType: 'delivery',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'canceled',
  },
];

/**
 * Displays the table with a variety of order statuses and fulfillment types.
 */
export const Default: Story = {
  args: {
    orders: mockOrders as any,
    totalOrders: 3,
  },
};

/**
 * State displayed when a listing exists but has not received any orders yet.
 */
export const EmptyState: Story = {
  args: {
    orders: [],
    totalOrders: 0,
  },
};

/**
 * Mobile view to check table responsiveness, horizontal scrolling, and status pill alignment.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};

/**
 * Displays how the table handles a larger dataset with scrolling.
 */
export const ManyOrders: Story = {
  args: {
    totalOrders: 20,
    orders: Array.from({ length: 15 }).map((_, i) => ({
      ...mockOrders[i % 3],
      id: `ord_batch_${i}`,
      quantityOz: (i + 1) * 16,
    })) as any,
  },
};
