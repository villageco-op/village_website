import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SubscriptionLocationCard } from './SubscriptionLocationCard';

import { Toaster } from '@/components/ui/sonner';
import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';

const meta: Meta<typeof SubscriptionLocationCard> = {
  title: 'Subscriptions/SubscriptionLocationCard',
  component: SubscriptionLocationCard,
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
type Story = StoryObj<typeof SubscriptionLocationCard>;

/**
 * Pickup state: Displays the seller's location information.
 */
export const Pickup: Story = {
  args: {
    subscription: BASE_MOCK_SUBSCRIPTION,
  },
};

/**
 * Delivery state: Displays the buyer's destination location.
 */
export const Delivery: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      fulfillmentType: 'delivery',
    },
  },
};

/**
 * State where the user or location object is missing/incomplete.
 * The component provides fallbacks for the map coordinates and address text.
 */
export const MissingLocation: Story = {
  args: {
    subscription: {
      ...BASE_MOCK_SUBSCRIPTION,
      fulfillmentType: 'pickup',
      seller: {
        ...BASE_MOCK_SUBSCRIPTION.seller,
        location: null as any,
      },
    },
  },
};
