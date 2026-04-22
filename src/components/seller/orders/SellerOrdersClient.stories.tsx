import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerOrdersClient from './SellerOrdersClient';

import type { getOrdersResponse200 } from '@/lib/api/generated/orders/orders';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_PENDING_ORDERS: getOrdersResponse200 = {
  status: 200,
  data: {
    data: [
      {
        id: 'ord_pending_1',
        totalAmount: '24.99',
        fulfillmentType: 'pickup',
        scheduledTime: new Date().toISOString(),
        status: 'pending',
        sellerId: 'seller-1',
        buyerId: 'buyer-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
      },
      {
        id: 'ord_pending_2',
        totalAmount: '15.00',
        fulfillmentType: 'delivery',
        scheduledTime: new Date().toISOString(),
        status: 'pending',
        sellerId: 'seller-1',
        buyerId: 'buyer-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
      },
    ],
    meta: { total: 2, page: 1, limit: 2, totalPages: 1 },
  },
};

const MOCK_HISTORY_ORDERS: getOrdersResponse200 = {
  status: 200,
  data: {
    data: [
      {
        id: 'ord_hist_1',
        totalAmount: '45.00',
        fulfillmentType: 'pickup',
        scheduledTime: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        sellerId: 'seller-1',
        buyerId: 'buyer-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'card',
        cancelReason: null,
        stripeReceiptUrl: 'https://stripe.com/receipt',
      },
    ],
    meta: { total: 1, page: 1, limit: 1, totalPages: 1 },
  },
};

const generateMockOrders = (count: number, prefix: string, status: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}-${prefix}-ord`,
    totalAmount: (10 + i).toFixed(2),
    fulfillmentType: i % 2 === 0 ? 'pickup' : 'delivery',
    scheduledTime: new Date().toISOString(),
    status: status,
    sellerId: 'seller-1',
    buyerId: `buyer-${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'card',
    cancelReason: null,
    stripeReceiptUrl: 'https://stripe.com/receipt',
  }));
};

const LARGE_PENDING_DATA = generateMockOrders(15, 'pending', 'pending');
const LARGE_HISTORY_DATA = generateMockOrders(15, 'history', 'completed');

const meta: Meta<typeof SellerOrdersClient> = {
  title: 'Seller/Orders/OrdersPage',
  component: SellerOrdersClient,
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
            <div className="mx-auto max-w-5xl">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerOrdersClient>;

/**
 * Full page view with both pending and historical orders populated.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', ({ request }) => {
          const url = new URL(request.url);
          const status = url.searchParams.get('status');

          if (status === 'pending') {
            return HttpResponse.json(MOCK_PENDING_ORDERS);
          }
          return HttpResponse.json(MOCK_HISTORY_ORDERS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify Header
    await expect(await canvas.findByText(/Pending Orders/i)).toBeInTheDocument();
    await expect(
      canvas.getByText(/2 pending · All time orders from buyers on Village/i),
    ).toBeInTheDocument();

    // Verify Cards
    await expect(canvas.getByText(/Order History/i)).toBeInTheDocument();
    await expect(canvas.getByText(/\$24.99/i)).toBeInTheDocument();
  },
};

/**
 * Page in a loading state, displaying the OrdersSkeleton.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * State where one or both of the API calls fail.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load orders data/i)).toBeInTheDocument();
  },
};

/**
 * Full page view for a seller with zero order activity.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0 } },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/0 pending · All time orders from buyers on Village/i),
    ).toBeInTheDocument();
    await expect(canvas.getByText(/No historical orders found/i)).toBeInTheDocument();
  },
};

/**
 * Story testing pagination for both Pending and History sections.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', ({ request }) => {
          const url = new URL(request.url);
          const status = url.searchParams.get('status');
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;

          const allItems = status === 'pending' ? LARGE_PENDING_DATA : LARGE_HISTORY_DATA;
          const start = (page - 1) * limit;
          const end = start + limit;
          const items = allItems.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: allItems.length,
                page,
                limit,
                totalPages: Math.ceil(allItems.length / limit),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText(/Order #1-PEND/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/#1-HIST/i)).toBeInTheDocument();

    await expect(canvas.queryByText(/Order #13-PEND/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/#13-HIST/i)).not.toBeInTheDocument();

    const pendingNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[0];
    pendingNextBtn.click();
    
    await expect(await canvas.findByText(/Order #13-PEND/i)).toBeInTheDocument();
    await expect(canvas.getByText(/#1-HIST/i)).toBeInTheDocument();
    
    const historyNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[1];
    historyNextBtn.click();

    await expect(await canvas.findByText(/#13-HIST/i)).toBeInTheDocument();
    
    await expect(canvas.queryByText(/Order #1-PEND/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/#1-HIST/i)).not.toBeInTheDocument();
  },
};
