import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerListingsClient from '../listings/SellerListingsClient';

import type { getSellerListingsResponse200 } from '@/lib/api/generated/produce/produce';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_LISTINGS: getSellerListingsResponse200 = {
  data: {
    data: [
      {
        id: '1',
        sellerId: 'seller_1',
        title: 'Organic Lacinato Kale',
        produceType: 'Kale',
        pricePerOz: '0.50',
        totalOzInventory: '320',
        availableBy: '2026-05-01',
        harvestFrequencyDays: 7,
        seasonStart: '2026-04-01',
        seasonEnd: '2026-10-01',
        images: [],
        isSubscribable: true,
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        analytics: {
          percentSold: 45,
          totalMonthlyEarnings: 120,
          totalOzSold: 12,
          numberOfOrders: 0,
          numberOfSubscriptions: 0,
          upcomingSubscriptionOzNeeded: 78,
          inventorySufficientForUpcoming: true,
          availableInventory: 24,
        },
      },
      {
        id: '2',
        sellerId: 'seller_1',
        title: 'Heirloom Tomatoes',
        produceType: 'Tomato',
        pricePerOz: '0.75',
        totalOzInventory: '160',
        availableBy: '2026-06-15',
        harvestFrequencyDays: 3,
        seasonStart: '2026-06-01',
        seasonEnd: '2026-09-15',
        images: [],
        isSubscribable: false,
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        analytics: {
          percentSold: 88,
          totalMonthlyEarnings: 450,
          totalOzSold: 12,
          numberOfOrders: 2,
          numberOfSubscriptions: 56,
          upcomingSubscriptionOzNeeded: 0,
          inventorySufficientForUpcoming: true,
          availableInventory: 160,
        },
      },
    ],
    meta: { total: 2, page: 1, limit: 2, totalPages: 1 },
  },
  status: 200,
};

const meta: Meta<typeof SellerListingsClient> = {
  title: 'Seller/Listings/ListingsPage',
  component: SellerListingsClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerListingsClient>;

/**
 * Standard view with several active listings and the "Add New" card.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return HttpResponse.json(MOCK_LISTINGS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check header
    await expect(await canvas.findByText(/2 active/i)).toBeInTheDocument();

    // Check if cards rendered
    await expect(canvas.getByText(/Organic Lacinato Kale/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Heirloom Tomatoes/i)).toBeInTheDocument();

    // Check if Add New card is present
    await expect(canvas.getByText(/Add a new listing/i)).toBeInTheDocument();
  },
};

/**
 * Loading state showing the 3-column skeleton grid.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * View when the seller has no listings yet.
 * Should show the header with 0 count and the Add New card.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return HttpResponse.json({ data: { data: [] }, status: 200 });
        }),
      ],
    },
  },
};

/**
 * Error state when the API fails to return listings.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load listings data/i)).toBeInTheDocument();
  },
};
