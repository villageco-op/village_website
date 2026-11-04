import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerDashboardClient from './SellerDashboardClient';

import { MOCK_SELLER_USER } from '@/lib/storybook/mocks/user.mock';
import {
  generateMockOrders,
  generateMockSubscriptions,
  createPaginatedResponse,
} from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_DASHBOARD_DATA = {
  sellerLocation: {
    lat: 0.0,
    lng: 34.0,
    address: 'Austin, TX',
  },
  earnedThisMonth: 1250.5,
  completedOrdersThisMonth: 56,
  pendingOrders: 3,
  activeSubscriptions: 5,
  onTrackWithGoal: true,
  monthlyGoal: 2000.0,
  earningsByProduceThisMonth: [
    { produceName: 'Strawberries', amount: 450 },
    { produceName: 'Tomatoes', amount: 300 },
    { produceName: 'Honey', amount: 500.5 },
  ],
};

const PAGE_LIMIT = 5;

const PAGINATED_ORDERS_DATA = generateMockOrders(25);
const PAGINATED_SUBSCRIPTIONS_DATA = generateMockSubscriptions(25);

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
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(PAGINATED_ORDERS_DATA, 1, PAGE_LIMIT)),
        ),
        http.get('*/api/subscriptions', () =>
          HttpResponse.json(createPaginatedResponse(PAGINATED_SUBSCRIPTIONS_DATA, 1, 3)),
        ),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_SELLER_USER,
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if header rendered
    await expect(await canvas.findByText(/, Green/i)).toBeInTheDocument();

    // Check if stats are visible
    await expect(canvas.getByText(/56/i)).toBeInTheDocument();

    // Check if progress is visible
    await expect(canvas.getByText(/1251/i)).toBeInTheDocument();

    // Check for specific produce in the breakdown
    await expect(canvas.getByText(/Strawberries/i)).toBeInTheDocument();
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
            sellerLocation: 'New York, NY',
            earnedThisMonth: 0,
            completedOrdersThisMonth: 0,
            pendingOrders: 0,
            activeSubscriptions: 0,
            onTrackWithGoal: false,
            monthlyGoal: 1000,
            earningsByProduceThisMonth: [],
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse([], 1, PAGE_LIMIT)),
        ),
        http.get('*/api/subscriptions', () =>
          HttpResponse.json(createPaginatedResponse([], 1, PAGE_LIMIT)),
        ),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_SELLER_USER,
          });
        }),
      ],
    },
  },
};
