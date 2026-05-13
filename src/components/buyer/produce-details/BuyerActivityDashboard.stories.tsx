import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerActivityDashboard from './BuyerActivityDashboard';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const PRODUCE_ID = 'prod_123';
const SELLER_ID = 'seller_456';

const MOCK_ORDERS = [
  {
    id: 'ord_active_1',
    status: 'pending',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord_past_1',
    status: 'completed',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_SUBS = [
  {
    id: 'sub_active_1',
    status: 'active',
    quantityOz: 16,
    fulfillmentType: 'delivery',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sub_past_1',
    status: 'canceled',
    quantityOz: 8,
    fulfillmentType: 'pickup',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const meta: Meta<typeof BuyerActivityDashboard> = {
  title: 'Buyer/ProduceDetails/BuyerActivityDashboard',
  component: BuyerActivityDashboard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="max-w-md mx-auto">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerActivityDashboard>;

/**
 * Shows both active and past orders/subscriptions.
 */
export const FullActivity: Story = {
  args: {
    produceId: PRODUCE_ID,
    sellerId: SELLER_ID,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({ data: { data: MOCK_ORDERS }, status: 200 });
        }),
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({ data: { data: MOCK_SUBS }, status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Your Activity')).toBeInTheDocument();
    await expect(canvas.getByText('Current & Pending')).toBeInTheDocument();
    await expect(canvas.getByText('Purchase History')).toBeInTheDocument();
  },
};

/**
 * View when there is only a single active subscription.
 */
export const ActiveSubscriptionOnly: Story = {
  args: { ...FullActivity.args },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({ data: { data: [] }, status: 200 });
        }),
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({ data: { data: [MOCK_SUBS[0]] }, status: 200 });
        }),
      ],
    },
  },
};

/**
 * View when there is only past order history.
 */
export const HistoryOnly: Story = {
  args: { ...FullActivity.args },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({ data: { data: [MOCK_ORDERS[1]] }, status: 200 });
        }),
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({ data: { data: [] }, status: 200 });
        }),
      ],
    },
  },
};

/**
 * Component returns null if no activity is found.
 */
export const EmptyState: Story = {
  args: { ...FullActivity.args },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return HttpResponse.json({ data: { data: [] }, status: 200 });
        }),
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json({ data: { data: [] }, status: 200 });
        }),
      ],
    },
  },
};

/**
 * Loading state showing the Skeleton.
 */
export const Loading: Story = {
  args: { ...FullActivity.args },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        http.get('*/api/subscriptions', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state with retry functionality.
 */
export const Error: Story = {
  args: { ...FullActivity.args },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/orders', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('*/api/subscriptions', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
