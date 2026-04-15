import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ListingOrdersClient from './ListingOrdersClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ID = 'prod_order_123';

const meta: Meta<typeof ListingOrdersClient> = {
  title: 'Pages/Seller/ListingOrdersPage',
  component: ListingOrdersClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    id: MOCK_ID,
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="bg-off-white min-h-screen">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ListingOrdersClient>;

/**
 * Successful state with a listing and multiple orders.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: { title: 'Heirloom Tomatoes' },
          });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: [
                {
                  id: 'ord_1',
                  buyer: { name: 'Alex River', image: '' },
                  quantityOz: 32,
                  totalAmount: '12.00',
                  fulfillmentType: 'pickup',
                  scheduledTime: new Date().toISOString(),
                  status: 'completed',
                },
                {
                  id: 'ord_2',
                  buyer: { name: 'Sam Smith', image: '' },
                  quantityOz: 16,
                  totalAmount: '6.50',
                  fulfillmentType: 'delivery',
                  scheduledTime: new Date().toISOString(),
                  status: 'pending',
                },
              ],
              meta: { total: 2 },
            },
          });
        }),
      ],
    },
  },
};

/**
 * Loading state using the custom ListingOrdersSkeleton.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * State when the listing exists but has no orders.
 */
export const EmptyOrders: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: { title: 'Honeycrisp Apples' },
          });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0 } },
          });
        }),
      ],
    },
  },
};

/**
 * Error state when the API fails to fetch data.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * Mobile view to ensure the full page layout and table scroll properly.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    ...Default.parameters,
  },
};
