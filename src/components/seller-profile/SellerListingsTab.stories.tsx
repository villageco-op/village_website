import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerListingsTab from './SellerListingsTab';

import type { ProduceListItem } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const SELLER_ID = 'seller_789';

const generateMockListings = (count: number, namePrefix = 'Listing'): ProduceListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod_${i + 1}`,
    name: `${namePrefix} ${i + 1}`,
    sellerId: SELLER_ID,
    sellerName: 'Green Valley Farm',
    sellerOrg: null,
    thumbnail:
      i % 3 === 0
        ? 'https://images.unsplash.com/photo-1597362868487-10501f930a04?w=400&h=300&fit=crop'
        : '',
    price: `$${(2.5 + i).toFixed(2)}/lb`,
    amount: `${10 + i} lbs`,
    availableBy: new Date(Date.now() + i * 86400000).toISOString(),
    distance: 0.6,
    isSubscribable: i % 2 === 0,
    description: `Freshly harvested ${namePrefix} ${i + 1}. Grown with organic practices and zero pesticides. Perfect for your weekly meals.`,
  }));
};

const ALL_MOCK_LISTINGS = generateMockListings(30);

const meta: Meta<typeof SellerListingsTab> = {
  title: 'Seller/Profile/SellerListingsTab',
  component: SellerListingsTab,
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
          <div className="max-w-4xl mx-auto bg-off-white p-6 rounded-xl">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerListingsTab>;

/**
 * Standard view with a grid of listings.
 */
export const Default: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
          return HttpResponse.json({
            data: ALL_MOCK_LISTINGS.slice(0, 12),
            meta: { total: 12, page: 1, limit: 12, totalPages: 1 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/12 active listings/i)).toBeInTheDocument();
  },
};

/**
 * Testing pagination with multiple pages of results.
 */
export const Paginated: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 12;
          const start = (page - 1) * limit;
          const data = ALL_MOCK_LISTINGS.slice(start, start + limit);

          return HttpResponse.json({
            data,
            meta: {
              total: ALL_MOCK_LISTINGS.length,
              page,
              limit,
              totalPages: Math.ceil(ALL_MOCK_LISTINGS.length / limit),
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Page 1
    await expect(await canvas.findByText('Listing 1')).toBeInTheDocument();

    // Go to Page 2
    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    // Page 2
    await expect(await canvas.findByText('Listing 13')).toBeInTheDocument();
    await expect(canvas.queryByText('Listing 1')).not.toBeInTheDocument();
  },
};

/**
 * Testing search filtering and debouncing.
 */
export const Searching: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search')?.toLowerCase();

          let filtered = ALL_MOCK_LISTINGS;
          if (search) {
            filtered = ALL_MOCK_LISTINGS.filter((item) => item.name.toLowerCase().includes(search));
          }

          return HttpResponse.json({
            data: filtered.slice(0, 12),
            meta: { total: filtered.length, page: 1, limit: 12, totalPages: 1 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = await canvas.findByPlaceholderText(/search listings/i);

    await userEvent.type(searchInput, 'Listing 5');

    // Wait for debounce and API response
    await waitFor(
      async () => {
        await expect(canvas.getByText('Listing 5')).toBeInTheDocument();
        await expect(canvas.queryByText('Listing 1')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  },
};

/**
 * State when no listings are found.
 */
export const NoResults: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
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
 * Loading state with skeletons.
 */
export const Loading: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state for API failures.
 */
export const ErrorState: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
