import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toaster } from '../ui/sonner';

import { OrderLocationCard } from './OrderLocationCard';

import { BASE_MOCK_ORDER_DETAIL } from '@/lib/storybook/mocks/order.mock';

const meta: Meta<typeof OrderLocationCard> = {
  title: 'Orders/OrderDetails/OrderLocationCard',
  component: OrderLocationCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Toaster />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrderLocationCard>;

export const Pickup: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      fulfillmentType: 'pickup',
    },
  },
};

export const Delivery: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      fulfillmentType: 'delivery',
    },
  },
};

export const MissingLocation: Story = {
  args: {
    order: {
      ...BASE_MOCK_ORDER_DETAIL,
      fulfillmentType: 'pickup',
      seller: {
        ...BASE_MOCK_ORDER_DETAIL.seller,
        location: null as any,
      },
    },
  },
};
