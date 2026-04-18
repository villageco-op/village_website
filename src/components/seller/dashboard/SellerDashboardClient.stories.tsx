import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerDashboardClient from './SellerDashboardClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_DASHBOARD_DATA = {
  data: {
    sellerLocation: {
      lat: 0.0,
      lng: 34.0,
      address: 'Austin, TX',
    },
    earnedThisMonth: 1250.5,
    earnedLastMonth: 980.0,
    soldThisWeekLbs: 45.2,
    onTrackWithGoal: true,
    activeListingsCount: 12,
    activeListingsNames: ['Organic Strawberries', 'Heirloom Tomatoes', 'Wild Honey'],
    monthlyGoal: 2000.0,
    earningsByProduceThisMonth: [
      { produceName: 'Strawberries', earned: 450 },
      { produceName: 'Tomatoes', earned: 300 },
      { produceName: 'Honey', earned: 500.5 },
    ],
  },
};

const meta: Meta<typeof SellerDashboardClient> = {
  title: 'Seller/Dashboard/DashboardPage',
  component: SellerDashboardClient,
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
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerDashboardClient>;

/**
 * Standard successful data load
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return HttpResponse.json(MOCK_DASHBOARD_DATA);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if header rendered
    await expect(await canvas.findByText(/Plot: Austin, TX/i)).toBeInTheDocument();

    // Check if stats are visible
    await expect(canvas.getAllByText(/1,250.5/i)).toHaveLength(2);
    await expect(canvas.getByText(/45.2 lbs/i)).toBeInTheDocument();

    // Check for specific produce in the breakdown
    await expect(canvas.getByText(/Organic Strawberries/i)).toBeInTheDocument();
  },
};

/**
 * Demonstrates the skeleton loading state
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Demonstrates the error state when the API fails
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorMsg = await canvas.findByText(/Failed to load dashboard data/i);
    await expect(errorMsg).toBeInTheDocument();
  },
};

/**
 * Dashboard state for a new seller with no data
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/dashboard', () => {
          return HttpResponse.json({
            data: {
              sellerLocation: 'New York, NY',
              earnedThisMonth: 0,
              earnedLastMonth: 0,
              soldThisWeekLbs: 0,
              onTrackWithGoal: false,
              activeListingsCount: 0,
              activeListingsNames: [],
              monthlyGoal: 1000,
              earningsByProduceThisMonth: [],
            },
          });
        }),
      ],
    },
  },
};
