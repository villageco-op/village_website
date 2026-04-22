import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ListingOrdersClient from './ListingOrdersClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ID = 'prod_order_123';

const PAGE_LIMIT = 12;

const generateMockOrders = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ord_${i + 1}`,
    buyer: { name: `Buyer ${i + 1}`, image: '' },
    quantityOz: 16,
    totalAmount: '10.00',
    fulfillmentType: i % 2 === 0 ? 'pickup' : 'delivery',
    scheduledTime: new Date().toISOString(),
    status: i % 3 === 0 ? 'completed' : 'pending',
  }));
};

const PAGINATED_ORDERS = generateMockOrders(25);

const meta: Meta<typeof ListingOrdersClient> = {
  title: 'Seller/ListingOrders/ListingOrdersPage',
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
              meta: { total: 2, totalPages: 1 },
            },
          });
        }),
      ],
    },
  },
};

/**
 * Pagination state with multiple pages of results.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: { title: 'Paginated Heirloom Tomatoes' },
          });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          
          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_ORDERS.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_ORDERS.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_ORDERS.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Buyer 1')).toBeInTheDocument();
    await expect(canvas.queryByText(`Buyer ${PAGE_LIMIT + 1}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    nextButton.click();

    await expect(await canvas.findByText(`Buyer ${PAGE_LIMIT + 1}`)).toBeInTheDocument();
    await expect(canvas.queryByText('Buyer 1')).not.toBeInTheDocument();
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
            data: { data: [], meta: { total: 0, totalPages: 0 } },
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
