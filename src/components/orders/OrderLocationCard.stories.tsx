import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { OrderLocationCard } from './OrderLocationCard';

import { Toaster } from '@/components/ui/sonner';
import { FulfillmentType } from '@/lib/api/generated/models';
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
    buyer: BASE_MOCK_ORDER_DETAIL.buyer,
    seller: BASE_MOCK_ORDER_DETAIL.seller,
    fulfillmentType: FulfillmentType.pickup,
  },
};

export const Delivery: Story = {
  args: {
    buyer: BASE_MOCK_ORDER_DETAIL.buyer,
    seller: BASE_MOCK_ORDER_DETAIL.seller,
    fulfillmentType: FulfillmentType.delivery,
  },
};

export const MissingLocation: Story = {
  args: {
    buyer: BASE_MOCK_ORDER_DETAIL.buyer,
    fulfillmentType: FulfillmentType.pickup,
    seller: {
      ...BASE_MOCK_ORDER_DETAIL.seller,
      location: null as any,
    },
  },
};
