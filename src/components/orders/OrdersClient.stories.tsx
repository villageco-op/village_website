'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import OrdersClient from './OrdersClient';

import { Toaster } from '@/components/ui/sonner';
import { createPaginatedResponse, generateMockOrders } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ORDERS_DATA = generateMockOrders(25);

const meta: Meta<typeof OrdersClient> = {
  title: 'Orders/OrdersPage',
  component: OrdersClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    role: 'seller',
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <div className="min-h-screen bg-slate-50">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrdersClient>;

/**
 * Verifies that the table loads correctly for a Seller,
 * displays pagination/header stats, and allows row selection to enable details view.
 */
export const DefaultSeller: Story = {
  args: {
    role: 'seller',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_ORDERS_DATA));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify table headers are present
    await expect(await canvas.findByText(/Product \/ Order/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/Name/i)).toBeInTheDocument();

    // Test row selection via row click
    const firstRow = await canvas.findByTestId(MOCK_ORDERS_DATA[0].id);
    await userEvent.click(firstRow);

    // Verify selection indicator and View Details button activation
    await expect(canvas.getByText(/Selected:/i)).toBeInTheDocument();
    const viewDetailsButton = canvas.getByRole('button', { name: /View Details/i });
    await expect(viewDetailsButton).toBeEnabled();
  },
};

/**
 * Verifies the dashboard correctly adapts for a Buyer role.
 */
export const DefaultBuyer: Story = {
  args: {
    role: 'buyer',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_ORDERS_DATA));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that the table renders with data in buyer mode
    const firstItemTitle = MOCK_ORDERS_DATA[0].items[0]?.product.title;
    if (firstItemTitle) {
      await expect(await canvas.findByText(firstItemTitle)).toBeInTheDocument();
    }
  },
};

/**
 * Verifies pagination functionality across multiple pages.
 */
export const Paginated: Story = {
  args: {
    role: 'seller',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;

          return HttpResponse.json(createPaginatedResponse(MOCK_ORDERS_DATA, page, limit));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstPageTitle = MOCK_ORDERS_DATA[0].items[0]?.product.title;
    const secondPageTitle = MOCK_ORDERS_DATA[12]?.items[0]?.product.title;

    if (firstPageTitle) {
      await expect(await canvas.findByText(firstPageTitle)).toBeInTheDocument();
    }
    if (secondPageTitle) {
      await expect(canvas.queryByText(secondPageTitle)).not.toBeInTheDocument();
    }

    const nextButton = await canvas.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    if (secondPageTitle) {
      await expect(await canvas.findByText(secondPageTitle)).toBeInTheDocument();
    }
    if (firstPageTitle) {
      await expect(canvas.queryByText(firstPageTitle)).not.toBeInTheDocument();
    }
  },
};

/**
 * Loading state with infinite delay.
 */
export const Loading: Story = {
  args: {
    role: 'seller',
  },
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
 * Empty state when no orders exist.
 */
export const EmptyState: Story = {
  args: {
    role: 'seller',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            data: [],
            meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
          });
        }),
      ],
    },
  },
};

/**
 * Error state handling API failure.
 */
export const ErrorState: Story = {
  args: {
    role: 'seller',
  },
  parameters: {
    msw: {
      handlers: [http.get('*/api/orders', () => new HttpResponse(null, { status: 500 }))],
    },
  },
};
