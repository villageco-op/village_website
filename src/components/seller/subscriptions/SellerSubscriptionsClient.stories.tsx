'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerSubscriptionsClient from './SellerSubscriptionsClient';

import { Toaster } from '@/components/ui/sonner';
import {
  createPaginatedResponse,
  generateMockSubscriptions,
} from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_SUBSCRIPTION_DATA = generateMockSubscriptions(25);

const meta: Meta<typeof SellerSubscriptionsClient> = {
  title: 'Seller/Subscriptions/SellerSubscriptionsPage',
  component: SellerSubscriptionsClient,
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
type Story = StoryObj<typeof SellerSubscriptionsClient>;

/**
 * Verifies that the dashboard loads and that hovering a card
 * reveals ID-based actions for both Buyer and Product.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_SUBSCRIPTION_DATA));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check header
    await expect(
      await canvas.findByText(/You are fulfilling 8 active subscriptions/i),
    ).toBeInTheDocument();

    // Check specific card content
    await expect(
      canvas.getByText(MOCK_SUBSCRIPTION_DATA[0].product.title + ' ↗'),
    ).toBeInTheDocument();
    await expect(canvas.getByText(MOCK_SUBSCRIPTION_DATA[0].buyer.name!)).toBeInTheDocument();

    // Test Hover Actions
    const firstCard = canvas
      .getByText(MOCK_SUBSCRIPTION_DATA[0].product.title + ' ↗')
      .closest('.group');
    if (firstCard) {
      await userEvent.hover(firstCard);

      // Verify Product Actions
      await expect(canvas.getAllByTitle(/Filter by Product/i)).toHaveLength(12);

      // Verify Buyer Actions
      await expect(canvas.getAllByTitle(/Filter by Buyer/i)).toHaveLength(12);
    }
  },
};

export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;

          return HttpResponse.json(createPaginatedResponse(MOCK_SUBSCRIPTION_DATA, page, limit));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Neighbor 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Neighbor 13')).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText('Neighbor 13')).toBeInTheDocument();
    await expect(canvas.queryByText('Neighbor 1')).not.toBeInTheDocument();
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
            data: [],
            meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
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
