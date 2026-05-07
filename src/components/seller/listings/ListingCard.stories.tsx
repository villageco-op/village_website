import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ListingCard } from './ListingCard';

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
      id: '1',
      sellerId: 'seller-123',
      title: 'Organic Lacinato Kale',
      description: 'We plant early in the spring and harvest throughout the year.',
      produceType: 'leafy_greens',
      pricePerOz: '0.50', // $8.00/lb
      totalOzInventory: '320',
      maxOrderQuantityOz: null,
      availableBy: new Date().toISOString(),
      status: 'active',
      harvestFrequencyDays: 7,
      seasonStart: '2024-01-01',
      seasonEnd: '2024-12-31',
      images: ['https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=100&h=100&fit=crop'],
      isSubscribable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      id: '2',
      sellerId: 'seller-123',
      title: 'Heirloom Tomatoes',
      description: '',
      produceType: 'nightshades',
      pricePerOz: '0.75', // $12.00/lb
      totalOzInventory: '160',
      maxOrderQuantityOz: null,
      availableBy: new Date().toISOString(),
      status: 'active',
      harvestFrequencyDays: 3,
      seasonStart: '2024-06-01',
      seasonEnd: '2024-09-01',
      images: {},
      isSubscribable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      ...ActiveWithAnalytics.args?.produce!,
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
      id: '3',
      sellerId: 'seller-123',
      title: 'Wild Strawberries',
      description: 'Grown wild.',
      produceType: 'berries',
      pricePerOz: '1.00',
      totalOzInventory: '80',
      maxOrderQuantityOz: null,
      availableBy: '2024-10-15T00:00:00Z',
      status: 'active',
      harvestFrequencyDays: 14,
      seasonStart: '2024-10-01',
      seasonEnd: '2024-11-01',
      images: {},
      isSubscribable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analytics: undefined,
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
      produceType: 'tropical_fruits',
    },
  },
};
