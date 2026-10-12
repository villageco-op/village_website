import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ListingCard } from './ListingCard';

import { MOCK_PRODUCE_LISTING } from '@/lib/storybook/mocks/produce.mock';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof ListingCard> = {
  title: 'Seller/Listings/ListingCard',
  component: ListingCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="min-h-screen bg-background p-8">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ListingCard>;

/**
 * An active listing with healthy inventory and sales performance.
 */
export const ActiveWithAnalytics: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_LISTING,
      status: 'active',
      analytics: {
        totalOzSold: 160,
        totalMonthlyEarnings: 120.0,
        numberOfSubscriptions: 8,
        numberOfOrders: 15,
        percentSold: 50,
        upcomingSubscriptionOzNeeded: 32,
        availableInventory: 160,
        inventorySufficientForUpcoming: true,
        nextHarvestDate: new Date().toISOString(),
      },
    },
  },
};

/**
 * A listing that has high demand and insufficient inventory
 * to cover upcoming subscriptions, triggering the AlertTriangle.
 */
export const InventoryAlert: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_LISTING,
      status: 'active',
      analytics: {
        totalOzSold: 140,
        totalMonthlyEarnings: 450.0,
        numberOfSubscriptions: 25,
        numberOfOrders: 10,
        percentSold: 88,
        upcomingSubscriptionOzNeeded: 80, // 5 lbs
        availableInventory: 20, // 1.25 lbs (Alert!)
        inventorySufficientForUpcoming: false,
        nextHarvestDate: '2024-08-20T00:00:00Z',
      },
    },
  },
};

/**
 * A listing that is currently paused. Note the yellow badge
 * and progress bar styling.
 */
export const PausedState: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_LISTING,
      status: 'paused',
      title: 'Fresh Basil (Paused)',
      produceType: 'fresh_herbs',
    },
  },
};

/**
 * A newly created listing that does not yet have an analytics
 * object returned from the API.
 */
export const NoAnalytics: Story = {
  args: {
    produce: {
      ...MOCK_PRODUCE_LISTING,
      analytics: {} as any,
    },
  },
};

/**
 * A listing with a produce type not covered by the
 * icon helper, falling back to the default package icon.
 */
export const FallbackIcon: Story = {
  args: {
    produce: {
      ...NoAnalytics.args?.produce!,
      title: 'Unknown Exotic Fruit',
      produceType: 'fruit',
    },
  },
};
