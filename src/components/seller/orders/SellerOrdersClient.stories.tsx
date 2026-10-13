import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerOrdersClient from './SellerOrdersClient';

import { OrderStatusProperty } from '@/lib/api/generated/models';
import { createPaginatedResponse } from '@/lib/storybook/utils/mockGenerators';
import { generateMockOrders } from '@/lib/storybook/utils/orderMockGenerators';

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
    await expect(canvas.getByText(/View pending and historical orders/i)).toBeInTheDocument();

    // Verify Cards
    await expect(canvas.getByText(/Order History/i)).toBeInTheDocument();
    await expect(canvas.getAllByText(/\$10.00/i)).toHaveLength(2);
    await expect(canvas.getAllByText(/\$11.00/i)).toHaveLength(1);
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

          return HttpResponse.json(createPaginatedResponse(allItems, page, limit));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial Page 1 assertions
    await expect(
      await canvas.findByText(/Pending Produce Batch #1- from Alpha Farm co./i),
    ).toBeInTheDocument();
    await expect(await canvas.findByText(/History Crate Item #1-/)).toBeInTheDocument();

    // Verify Page 2 items are not visible initially
    await expect(canvas.queryByText(/Pending Produce Batch #13-/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/History Crate Item #13-/i)).not.toBeInTheDocument();

    // Paginate Pending section to Page 2
    const pendingNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[0];
    pendingNextBtn.click();

    await expect(await canvas.findByText(/Pending Produce Batch #13-/i)).toBeInTheDocument();
    await expect(canvas.getByText(/History Crate Item #1-/)).toBeInTheDocument();

    // Paginate History section to Page 2
    const historyNextBtn = (await canvas.findAllByRole('button', { name: /Next/i }))[1];
    historyNextBtn.click();

    await expect(await canvas.findByText(/History Crate Item #13-/i)).toBeInTheDocument();

    // Verify Page 1 items are no longer present
    await expect(canvas.queryByText(/Pending Produce Batch #1-/i)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/History Crate Item #1-/i)).not.toBeInTheDocument();
  },
};
