import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerSubscriptionDetailClient from './SellerSubscriptionDetailsClient';

import { SubscriptionStatus } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_SUB_ID = 'sub-detail-1';

const generateMockSubscription = (overrides = {}) => ({
  status: 200,
  data: {
    id: MOCK_SUB_ID,
    status: SubscriptionStatus.active,
    createdAt: '2026-03-01T12:00:00Z',
    quantityOz: '16',
    fulfillmentType: 'delivery',
    nextDeliveryDate: '2026-05-20T10:00:00Z',
    cancelReason: null,
    buyer: {
      id: 'user-buyer-1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
    },
    seller: {
      id: 'user-seller-1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
    },
    product: {
      id: 'prod-001',
      title: 'Heirloom Carrots',
      produceType: 'Root Vegetables',
      pricePerOz: '0.50',
    },
    ...overrides,
  },
});

const meta: Meta<typeof SellerSubscriptionDetailClient> = {
  title: 'Seller/Subscriptions/Details/SellerSubscriptionDetailClient',
  component: SellerSubscriptionDetailClient,
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
          <div className="min-h-screen bg-off-white">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  args: {
    id: 'sub-detail-1',
  },
};

export default meta;
type Story = StoryObj<typeof SellerSubscriptionDetailClient>;

/**
 * Standard active subscription where the seller can choose to pause or cancel.
 */
export const Active: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${MOCK_SUB_ID}`, () => {
          return HttpResponse.json(generateMockSubscription());
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Subscription Details')).toBeInTheDocument();
    await expect(canvas.getByText('Pause Subscription')).toBeInTheDocument();
    await expect(canvas.getByText('Cancel Subscription')).toBeInTheDocument();
  },
};

/**
 * Paused subscription showing the resume button and the reason it was paused.
 */
export const Paused: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${MOCK_SUB_ID}`, () => {
          return HttpResponse.json(
            generateMockSubscription({
              status: SubscriptionStatus.paused,
              cancelReason: 'Crop needs time to regrow after heavy harvest.',
            }),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Resume Subscription/i)).toBeInTheDocument();
    await expect(
      canvas.getByText('Crop needs time to regrow after heavy harvest.'),
    ).toBeInTheDocument();
  },
};

/**
 * Permanently canceled subscription. Action buttons are hidden.
 */
export const Canceled: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${MOCK_SUB_ID}`, () => {
          return HttpResponse.json(
            generateMockSubscription({
              status: SubscriptionStatus.canceled,
              cancelReason: 'Moving farms, unable to fulfill long-term orders.',
            }),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText('Moving farms, unable to fulfill long-term orders.'),
    ).toBeInTheDocument();
    await expect(canvas.queryByText('Cancel Subscription')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Pause Subscription')).not.toBeInTheDocument();
  },
};

/**
 * Loading state displaying the OrderDetailSkeleton.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${MOCK_SUB_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state when the subscription fails to fetch or returns 404.
 */
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/subscriptions/${MOCK_SUB_ID}`, () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Subscription not found')).toBeInTheDocument();
  },
};
