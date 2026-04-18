import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerBillingClient from './BuyerBillingClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const meta: Meta<typeof BuyerBillingClient> = {
  title: 'Buyer/Billing/BillingPage',
  component: BuyerBillingClient,
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
          <div className="bg-off-white min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerBillingClient>;

/**
 * Successful state with both summary stats and a history of orders.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              totalSpent: 842.5,
              totalProduceLbs: 312,
              avgCostPerLb: 2.7,
              localSourcingPercentage: 92,
            },
          });
        }),
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: [
                {
                  id: 'ord_f3a1b2c3',
                  totalAmount: '150.00',
                  fulfillmentType: 'delivery',
                  scheduledTime: new Date().toISOString(),
                  status: 'completed',
                  paymentMethod: 'card',
                },
                {
                  id: 'ord_e4d5c6b7',
                  totalAmount: '42.25',
                  fulfillmentType: 'pickup',
                  scheduledTime: new Date(Date.now() - 86400000 * 5).toISOString(),
                  status: 'completed',
                  paymentMethod: 'snap',
                },
              ],
              meta: { total: 2, page: 1, limit: 50, totalPages: 1 },
            },
          });
        }),
      ],
    },
  },
};

/**
 * Loading state showing the skeleton UI for all three sections.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        http.get('*/api/orders', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * State where the buyer exists but hasn't placed any orders yet.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              totalSpent: 0,
              totalProduceLbs: 0,
              avgCostPerLb: 0,
              localSourcingPercentage: 0,
            },
          });
        }),
        http.get('*/api/orders', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } },
          });
        }),
      ],
    },
  },
};

/**
 * Generic error state when the API returns a failure.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/billing-summary', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('*/api/orders', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * Mobile view to verify vertical stacking of stats and table responsiveness.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    ...Default.parameters,
  },
};
