import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerDashboardClient from './BuyerDashboardClient';

import { MOCK_GROWERS_LIST } from '@/lib/storybook/mocks/grower.mock';
import { MOCK_BUYER_USER } from '@/lib/storybook/mocks/user.mock';
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

const PAGE_LIMIT = 5;

const PAGINATED_ORDERS_DATA = generateMockOrders(25);
const PAGINATED_SUBSCRIPTIONS_DATA = generateMockSubscriptions(25);

const MOCK_DASHBOARD_STATS = {
  onOrderThisWeekLbs: 342,
  totalSpendThisMonth: '1850.50',
  activeSubscriptions: 3,
  localGrowersSupplying: 6,
};

const meta: Meta<typeof BuyerDashboardClient> = {
  title: 'Buyer/Dashboard/DashboardPage',
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

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => HttpResponse.json(MOCK_DASHBOARD_STATS)),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse(PAGINATED_ORDERS_DATA, 1, PAGE_LIMIT)),
        ),
        http.get('*/api/growers/growers-map*', () => HttpResponse.json(MOCK_GROWERS_LIST)),
        http.get('*/api/subscriptions', () =>
          HttpResponse.json(createPaginatedResponse(PAGINATED_SUBSCRIPTIONS_DATA, 1, 3)),
        ),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_BUYER_USER,
          });
        }),
      ],
    },
  },
};

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

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => new HttpResponse(null, { status: 500 })),
        http.get('*/api/orders*', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => {
          return HttpResponse.json({
            ...MOCK_DASHBOARD_STATS,
            onOrderThisWeekLbs: 0,
            totalSpendThisMonth: '0',
            activeSubscriptions: 0,
            localGrowersSupplying: 0,
          });
        }),
        http.get('*/api/orders*', () =>
          HttpResponse.json(createPaginatedResponse([], 1, PAGE_LIMIT)),
        ),
        http.get('*/api/growers/growers-map*', () => HttpResponse.json([])),
        http.get('*/api/subscriptions', () =>
          HttpResponse.json(createPaginatedResponse([], 1, PAGE_LIMIT)),
        ),
        http.get('*/api/auth/session', () => {
          return HttpResponse.json({
            user: MOCK_BUYER_USER,
          });
        }),
      ],
    },
  },
};
