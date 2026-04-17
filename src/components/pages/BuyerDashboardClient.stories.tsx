import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerDashboardClient from './BuyerDashboardClient';

import {
  OrderStatusProperty,
  OrderPaymentMethod,
  OrderFulfillmentType,
} from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof BuyerDashboardClient> = {
  title: 'Pages/Buyer/Dashboard',
  component: BuyerDashboardClient,
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
          <div className="min-h-screen bg-slate-50/30 p-8">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerDashboardClient>;

const MOCK_DASHBOARD_STATS = {
  onOrderThisWeekLbs: 342,
  percentChangeFromLastWeek: 15.4,
  totalSpendThisMonth: '1850.50',
  totalSpendLastMonth: '1600.00',
  activeSubscriptions: [
    { id: 'sub-1', produceName: 'Organic Spinach' },
    { id: 'sub-2', produceName: 'Heirloom Tomatoes' },
    { id: 'sub-3', produceName: 'Bell Peppers' },
  ],
  localGrowersSupplying: 6,
  furthestGrowerDistanceMiles: 24.5,
  avgGrowerDistanceMiles: 8.2,
};

const MOCK_ORDERS = {
  data: [
    {
      id: 'ORD-7721',
      buyerId: 'me',
      sellerId: 'grower-alpha',
      paymentMethod: OrderPaymentMethod.card,
      fulfillmentType: OrderFulfillmentType.delivery,
      scheduledTime: new Date().toISOString(),
      status: OrderStatusProperty.pending,
      totalAmount: '85.20',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ORD-7722',
      buyerId: 'me',
      sellerId: 'grower-beta',
      paymentMethod: OrderPaymentMethod.snap,
      fulfillmentType: OrderFulfillmentType.pickup,
      scheduledTime: new Date(Date.now() + 86400000).toISOString(),
      status: OrderStatusProperty.pending,
      totalAmount: '42.00',
      createdAt: new Date().toISOString(),
    },
  ],
};

const MOCK_GROWERS_LIST = {
  data: [
    {
      sellerId: 'grower-alpha',
      name: 'Alpha Farms',
      location: { lat: 41.61, lng: -87.34 },
    },
    {
      sellerId: 'grower-beta',
      name: 'Beta Gardens',
      location: { lat: 41.59, lng: -87.32 },
    },
  ],
};

/**
 * The standard "Happy Path" for a buyer with active orders and stats.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => {
          return HttpResponse.json({ status: 200, data: MOCK_DASHBOARD_STATS });
        }),
        http.get('*/api/orders*', () => {
          return HttpResponse.json({ status: 200, data: MOCK_ORDERS });
        }),
        http.get('*/api/buyer/growers*', () => {
          return HttpResponse.json({ status: 200, data: MOCK_GROWERS_LIST });
        }),
      ],
    },
  },
};

/**
 * Visualizes the loading skeletons across the entire page.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Displays the error UI when one or more essential APIs fail.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('*/api/orders*', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * Dashboard for a buyer who has no history or pending orders yet.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              ...MOCK_DASHBOARD_STATS,
              onOrderThisWeekLbs: 0,
              percentChangeFromLastWeek: 0,
              totalSpendThisMonth: '0',
              activeSubscriptions: [],
              localGrowersSupplying: 0,
            },
          });
        }),
        http.get('*/api/orders*', () => {
          return HttpResponse.json({ status: 200, data: { data: [] } });
        }),
        http.get('*/api/buyer/growers*', () => {
          return HttpResponse.json({ status: 200, data: { data: [] } });
        }),
      ],
    },
  },
};
