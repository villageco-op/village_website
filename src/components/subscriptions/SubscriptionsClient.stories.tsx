'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SubscriptionsClient from './SubscriptionsClient';

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

const meta: Meta<typeof SubscriptionsClient> = {
  title: 'Subscriptions/SubscriptionsPage',
  component: SubscriptionsClient,
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
type Story = StoryObj<typeof SubscriptionsClient>;

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
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_SUBSCRIPTION_DATA));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify table headers are present
    await expect(await canvas.findByText(/Product/i)).toBeInTheDocument();
    await expect(await canvas.findByText(/From/i)).toBeInTheDocument();

    // Test row selection via radio / row click
    const firstRow = await canvas.findByTestId(MOCK_SUBSCRIPTION_DATA[0].id); // HERE
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
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_SUBSCRIPTION_DATA));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that the table renders with data in buyer mode
    await expect(
      await canvas.findByText(MOCK_SUBSCRIPTION_DATA[0].product.title),
    ).toBeInTheDocument();
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

    const nextButton = await canvas.findByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText('Neighbor 13')).toBeInTheDocument();
    await expect(canvas.queryByText('Neighbor 1')).not.toBeInTheDocument();
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
        http.get('*/api/subscriptions', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Empty state when no subscriptions exist.
 */
export const EmptyState: Story = {
  args: {
    role: 'seller',
  },
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

/**
 * Error state handling API failure.
 */
export const ErrorState: Story = {
  args: {
    role: 'seller',
  },
  parameters: {
    msw: {
      handlers: [http.get('*/api/subscriptions', () => new HttpResponse(null, { status: 500 }))],
    },
  },
};
