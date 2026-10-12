import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SellerSubscriptionCard } from './SellerSubscriptionCard';

import { Toaster } from '@/components/ui/sonner';
import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';

const meta: Meta<typeof SellerSubscriptionCard> = {
  title: 'Seller/Subscriptions/SellerSubscriptionCard',
  component: SellerSubscriptionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-120 bg-slate-50 p-4">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionCard>;

export const Active: Story = {
  args: {
    subscription: BASE_MOCK_SUBSCRIPTION,
    index: 0,
  },
};

export const Paused: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      status: 'paused',
    },
    index: 1,
  },
};

export const PickupPending: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      fulfillmentType: 'pickup',
      nextDeliveryDate: null,
    },
    index: 2,
  },
};

export const AnonymousBuyer: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      buyer: null as any,
    },
    index: 3,
  },
};
