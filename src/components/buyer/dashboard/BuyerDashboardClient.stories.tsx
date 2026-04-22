import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
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

const PAGE_LIMIT = 5;

const generateMockOrders = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${7000 + i}`,
    buyerId: 'me',
    sellerId: i % 2 === 0 ? 'grower-alpha' : 'grower-beta',
    paymentMethod: OrderPaymentMethod.card,
    fulfillmentType: OrderFulfillmentType.delivery,
    scheduledTime: new Date().toISOString(),
    status: OrderStatusProperty.pending,
    totalAmount: (Math.random() * 100 + 20).toFixed(2),
    createdAt: new Date().toISOString(),
  }));
};

const PAGINATED_ORDERS_DATA = generateMockOrders(25);

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
        http.get('*/api/buyer/dashboard', () => HttpResponse.json({ status: 200, data: MOCK_DASHBOARD_STATS })),
        http.get('*/api/orders*', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: PAGINATED_ORDERS_DATA.slice(0, 2),
              meta: { total: 2, page: 1, limit: PAGE_LIMIT, totalPages: 1 }
            }
          });
        }),
        http.get('*/api/buyer/growers*', () => HttpResponse.json({ status: 200, data: MOCK_GROWERS_LIST })),
      ],
    },
  },
};

/**
 * Pagination state specifically for the Orders list.
 */
export const OrdersPaginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/dashboard', () => HttpResponse.json({ status: 200, data: MOCK_DASHBOARD_STATS })),
        http.get('*/api/buyer/growers*', () => HttpResponse.json({ status: 200, data: MOCK_GROWERS_LIST })),
        http.get('*/api/orders*', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_ORDERS_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_ORDERS_DATA.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_ORDERS_DATA.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText(/#ORD-7000/i)).toBeInTheDocument();
    await expect(canvas.queryByText(/#ORD-7005/i)).not.toBeInTheDocument();

    const pageTwoButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(pageTwoButton);

    await expect(await canvas.findByText(/#ORD-7005/i)).toBeInTheDocument();
    await expect(canvas.queryByText(/#ORD-7000/i)).not.toBeInTheDocument();
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
        http.get('*/api/orders*', () => HttpResponse.json({ status: 200, data: { data: [], meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 } } })),
        http.get('*/api/buyer/growers*', () => HttpResponse.json({ status: 200, data: { data: [] } })),
      ],
    },
  },
};
