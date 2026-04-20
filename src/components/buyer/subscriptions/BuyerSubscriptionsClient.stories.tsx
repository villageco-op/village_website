import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerSubscriptionsClient from './BuyerSubscriptionsClient';

import { SubscriptionStatus } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_SUBSCRIPTIONS = {
  status: 200,
  data: {
    data: [
      {
        id: 'sub-1',
        quantityOz: '12',
        status: SubscriptionStatus.active,
        fulfillmentType: 'delivery',
        nextDeliveryDate: '2026-05-20T10:00:00Z',
        product: { title: 'Fresh Basil' },
        seller: { name: 'Green Thumb Farm' },
      },
      {
        id: 'sub-2',
        quantityOz: '8',
        status: SubscriptionStatus.paused,
        fulfillmentType: 'pickup',
        nextDeliveryDate: null,
        product: { title: 'Wild Arugula' },
        seller: { name: 'Urban Sprout' },
      },
      {
        id: 'sub-3',
        quantityOz: '16',
        status: SubscriptionStatus.active,
        fulfillmentType: 'delivery',
        nextDeliveryDate: '2026-05-22T08:00:00Z',
        product: { title: 'Heirloom Tomatoes' },
        seller: { name: 'Valley Creek' },
      },
    ],
    meta: { total: 3, page: 1, limit: 10, totalPages: 1 },
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
          <div className="min-h-screen bg-background">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerSubscriptionsClient>;

/**
 * Standard view with a list of active and paused subscriptions.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(MOCK_SUBSCRIPTIONS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify header count (2 active out of 3 total)
    await expect(await canvas.findByText(/2 active subscriptions/i)).toBeInTheDocument();
    // Verify specific product cards
    await expect(canvas.getByText('Fresh Basil')).toBeInTheDocument();
    await expect(canvas.getByText('Wild Arugula')).toBeInTheDocument();
  },
};

/**
 * Loading state showing the SubscriptionsSkeleton.
 */
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

/**
 * Empty state for users with no subscriptions.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/don't have any active subscriptions yet/i),
    ).toBeInTheDocument();
  },
};

/**
 * Error state when the API call fails or returns a non-200 status.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/subscriptions', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load your subscriptions/i)).toBeInTheDocument();
  },
};
