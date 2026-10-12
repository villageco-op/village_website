import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionSummaryCard } from './SubscriptionSummaryCard';

import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';

const meta: Meta<typeof SubscriptionSummaryCard> = {
  title: 'Subscriptions/SubscriptionSummaryCard',
  component: SubscriptionSummaryCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubscriptionSummaryCard>;

export const Default: Story = {
  args: {
    subscription: BASE_MOCK_SUBSCRIPTION,
  },
};

export const PendingDelivery: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      nextDeliveryDate: null,
    },
  },
};

export const CustomFrequency: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      product: {
        ...BASE_MOCK_SUBSCRIPTION.product,
        title: 'Microgreens Subscription',
        harvestFrequencyDays: 3,
        pricePerOz: '4.50',
      },
      quantityOz: '4',
    },
  },
};
