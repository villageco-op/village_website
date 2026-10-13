import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionCard } from './SubscriptionCard';

import { Toaster } from '@/components/ui/sonner';
import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';

const meta: Meta<typeof SubscriptionCard> = {
  title: 'Buyer/Subscriptions/SubscriptionCard',
  component: SubscriptionCard,
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
type Story = StoryObj<typeof SubscriptionCard>;

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

export const PendingDelivery: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      nextDeliveryDate: null,
    },
    index: 2,
  },
};

export const MissingData: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      product: { ...BASE_MOCK_SUBSCRIPTION.product, title: '' },
      seller: {} as any,
    },
    index: 3,
  },
};
