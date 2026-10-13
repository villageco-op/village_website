import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerOrdersClient from './BuyerOrdersClient';

import { OrderStatusProperty } from '@/lib/api/generated/models';
import { createPaginatedResponse, generateMockOrders } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_PENDING_ORDERS = createPaginatedResponse(
  generateMockOrders(2, 'PEND', OrderStatusProperty.pending),
);

const MOCK_HISTORY_ORDERS = createPaginatedResponse(
  generateMockOrders(1, 'HIST', OrderStatusProperty.completed),
);

const LARGE_PENDING_DATA = generateMockOrders(15, 'PEND', OrderStatusProperty.pending);
const LARGE_HISTORY_DATA = generateMockOrders(15, 'HIST', OrderStatusProperty.completed);

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
    await expect(await canvas.findAllByText(/\$10\.00/i)).toHaveLength(2);
    await expect(await canvas.findAllByText(/\$11\.00/i)).toHaveLength(1);
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
          return HttpResponse.json(createPaginatedResponse([]));
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

          const allItems = status === 'pending' ? LARGE_PENDING_DATA : LARGE_HISTORY_DATA;

          return HttpResponse.json(createPaginatedResponse(allItems, page, 12));
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
