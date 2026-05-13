'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerSubscriptionsClient from './BuyerSubscriptionsClient';

import { Toaster } from '@/components/ui/sonner';
import { SubscriptionStatus } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const generateMockSubscriptions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sub-${i + 1}`,
    quantityOz: (i + 4).toString(),
    status: i % 3 === 0 ? SubscriptionStatus.paused : SubscriptionStatus.active,
    fulfillmentType: i % 2 === 0 ? 'delivery' : 'pickup',
    nextDeliveryDate: '2026-06-15T10:00:00Z',
    product: { title: `Premium Produce ${i + 1}` },
    seller: { name: `Farmer ${i + 1}`, id: `seller_${i + 1}` },
  }));
};

const PAGINATED_DATA = generateMockSubscriptions(25);

const MOCK_SUBSCRIPTIONS = {
  status: 200,
  data: {
    data: PAGINATED_DATA.slice(0, 3),
    meta: { total: 3, page: 1, limit: 12, totalPages: 1, activeCount: 2 },
  },
};

const meta: Meta<typeof BuyerSubscriptionsClient> = {
  title: 'Buyer/Subscriptions/SubscriptionsPage',
  component: BuyerSubscriptionsClient,
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
          <div className="min-h-screen bg-slate-50">
            <Story />
            <Toaster />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerSubscriptionsClient>;

/**
 * Standard view. Tests hover states to ensure Copy/Filter buttons appear.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/subscriptions', () => HttpResponse.json(MOCK_SUBSCRIPTIONS))],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial data
    await expect(await canvas.findByText(/2 active subscriptions/i)).toBeInTheDocument();

    // Test Hover Interaction for hidden buttons
    const firstCard = canvas.getByText(/Premium Produce 1 /i).closest('.group');
    if (firstCard) {
      await userEvent.hover(firstCard);
      // Verify buttons are now accessible (using the titles added in the previous step)
      await expect(canvas.getAllByTitle(/Copy Seller ID/i)).toHaveLength(3);
      await expect(canvas.getAllByTitle(/Filter by this Seller/i)).toHaveLength(3);
    }
  },
};

/**
 * Pagination state showing navigation between pages.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;

          const start = (page - 1) * limit;
          const end = start + limit;
          const items = PAGINATED_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_DATA.length,
                page,
                limit,
                totalPages: Math.ceil(PAGINATED_DATA.length / limit),
                activeCount: 19,
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check Page 1 content
    await expect(await canvas.findByText(/Premium Produce 1 /i)).toBeInTheDocument();
    await expect(canvas.queryByText(/Premium Produce 13/i)).not.toBeInTheDocument();

    // Navigate to Page 2
    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    // Verify Page 2 content
    await expect(await canvas.findByText(/Premium Produce 13/i)).toBeInTheDocument();
    await expect(canvas.queryByText(/Premium Produce 1 /i)).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: [],
              meta: { total: 0, page: 1, limit: 12, totalPages: 0, activeCount: 0 },
            },
          });
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/subscriptions', () => new HttpResponse(null, { status: 500 }))],
    },
  },
};
