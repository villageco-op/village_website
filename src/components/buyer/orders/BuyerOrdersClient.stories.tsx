import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerOrdersClient from './BuyerOrdersClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_PENDING_ORDERS = {
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
      stripeInvoiceId: 'invoice_id',
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
      stripeInvoiceId: 'invoice_id',
    },
  ],
  meta: { total: 2, page: 1, limit: 12, totalPages: 1 },
};

const MOCK_HISTORY_ORDERS = {
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
      stripeInvoiceId: 'invoice_id',
    },
  ],
  meta: { total: 1, page: 1, limit: 12, totalPages: 1 },
};

const generateMockOrders = (count: number, prefix: string, status: string) => {
  const isPending = prefix.toLowerCase().includes('pend');
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}-${prefix}-ord`,
    totalAmount: (10 + i).toFixed(2),
    fulfillmentType: i % 2 === 0 ? 'pickup' : 'delivery',
    scheduledTime: new Date().toISOString(),
    status,
    sellerId: `seller-${i}`,
    buyerId: 'buyer-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentMethod: 'card',
    cancelReason: null,
    stripeReceiptUrl: 'https://stripe.com/receipt',
    items: [
      {
        product: {
          title: `${isPending ? 'Pending Produce Batch' : 'History Crate Item'} #${i + 1}-`,
        },
      },
    ],
  }));
};

const LARGE_PENDING_DATA = generateMockOrders(15, 'PEND', 'pending');
const LARGE_HISTORY_DATA = generateMockOrders(15, 'HIST', 'completed');

const meta: Meta<typeof BuyerOrdersClient> = {
  title: 'Buyer/Orders/OrdersPage',
  component: BuyerOrdersClient,
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
type Story = StoryObj<typeof BuyerOrdersClient>;

/**
 * Default view displaying both pending and completed historical orders for a buyer.
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

    await expect(
      await canvas.findByText(/View pending and historical orders/i),
    ).toBeInTheDocument();

    // Verify Pending and History Cards render content
    await expect(canvas.getByText(/\$24.99/i)).toBeInTheDocument();
    await expect(canvas.getByText(/\$45.00/i)).toBeInTheDocument();
  },
};

/**
 * Loading state showing the skeleton placeholder.
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
 * Error state when fetching pending or historical orders fails.
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
    await expect(await canvas.findByText(/Failed to load orders data\./i)).toBeInTheDocument();
  },
};

/**
 * Empty state when the buyer has no pending or historical orders.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({ data: [], meta: { total: 0 } });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText(/View pending and historical orders/i),
    ).toBeInTheDocument();
  },
};

/**
 * Story testing pagination behavior across pending and historical orders.
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
            data: items,
            meta: {
              total: allItems.length,
              page,
              limit,
              totalPages: Math.ceil(allItems.length / limit),
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial Page 1 assertions
    await expect(await canvas.findByText(/Pending Produce Batch #1-/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/History Crate Item #1-/i)).toBeInTheDocument();

    // Verify Page 2 items are not visible initially
    await expect(canvas.queryByText(/Pending Produce Batch #13-/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/History Crate Item #13-/i)).not.toBeInTheDocument();

    // Paginate pending orders section
    const pendingNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[0];
    pendingNextBtn.click();

    await expect(await canvas.findByText(/Pending Produce Batch #13-/i)).toBeInTheDocument();
    await expect(canvas.getByText(/History Crate Item #1-/i)).toBeInTheDocument();

    // Paginate history orders section
    const historyNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[1];
    historyNextBtn.click();

    await expect(await canvas.findByText(/History Crate Item #13-/i)).toBeInTheDocument();

    // Verify Page 1 items are no longer present
    await expect(canvas.queryByText(/Pending Produce Batch #1-/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/History Crate Item #1-/i)).not.toBeInTheDocument();
  },
};
