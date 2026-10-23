import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ListingOrdersClient from './ListingOrdersClient';

import {
  createPaginatedResponse,
  generateMockProduceOrderListItems,
} from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ID = 'prod_order_123';
const PAGE_LIMIT = 12;

const PAGINATED_ORDERS_DATA = generateMockProduceOrderListItems(25);

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
          return HttpResponse.json({ title: 'Heirloom Tomatoes' });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, () => {
          return HttpResponse.json(createPaginatedResponse(PAGINATED_ORDERS_DATA, 1, PAGE_LIMIT));
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
          return HttpResponse.json({ title: 'Paginated Heirloom Tomatoes' });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          return HttpResponse.json(
            createPaginatedResponse(PAGINATED_ORDERS_DATA, page, PAGE_LIMIT),
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Buyer 1')).toBeInTheDocument();
    await expect(canvas.queryByText(`Buyer ${PAGE_LIMIT + 1}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next/i });
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
          return HttpResponse.json({ title: 'Honeycrisp Apples' });
        }),
        http.get(`*/api/produce/${MOCK_ID}/orders`, () => {
          return HttpResponse.json({ data: [], meta: { total: 0, totalPages: 0 } });
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
