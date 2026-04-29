import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerListingsClient from '../listings/SellerListingsClient';

import type { ProduceType } from '@/lib/api/generated/models';
import type { ProduceStatusProperty } from '@/lib/api/generated/models/produceStatusProperty';
import type { getSellerListingsResponse200 } from '@/lib/api/generated/produce/produce';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const PAGE_LIMIT = 12;

const generateMockListings = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `list_${i + 1}`,
    sellerId: 'seller_1',
    title: `Listing Item ${i + 1}`,
    produceType: 'root_vegetables' as ProduceType,
    pricePerOz: '0.50',
    totalOzInventory: '100',
    maxOrderQuantityOz: null,
    availableBy: '2026-05-01',
    harvestFrequencyDays: 7,
    seasonStart: '2026-04-01',
    seasonEnd: '2026-10-01',
    images: [],
    isSubscribable: true,
    status: 'active' as ProduceStatusProperty,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    analytics: {
      percentSold: 10,
      totalMonthlyEarnings: 50,
      totalOzSold: 5,
      numberOfOrders: 1,
      numberOfSubscriptions: 1,
      upcomingSubscriptionOzNeeded: 10,
      inventorySufficientForUpcoming: true,
      availableInventory: 90,
    },
  }));
};

const PAGINATED_LISTINGS_DATA = generateMockListings(25);

const MOCK_LISTINGS: getSellerListingsResponse200 = {
  data: {
    data: PAGINATED_LISTINGS_DATA.slice(0, 2),
    meta: { total: 2, page: 1, limit: 2, totalPages: 1 },
  },
  status: 200,
};

const meta: Meta<typeof SellerListingsClient> = {
  title: 'Seller/Listings/ListingsPage',
  component: SellerListingsClient,
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
          <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerListingsClient>;

/**
 * Standard view with several active listings and the "Add New" card.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return HttpResponse.json(MOCK_LISTINGS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/2 active/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Listing Item 1/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Add a new listing/i)).toBeInTheDocument();
  },
};

/**
 * Pagination state with multiple pages of listings.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_LISTINGS_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_LISTINGS_DATA.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_LISTINGS_DATA.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify Page 1
    await expect(await canvas.findByText('Listing Item 1')).toBeInTheDocument();
    await expect(canvas.queryByText(`Listing Item ${PAGE_LIMIT + 1}`)).not.toBeInTheDocument();

    // Navigate to Page 2
    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    nextButton.click();

    // Verify Page 2
    await expect(await canvas.findByText(`Listing Item ${PAGE_LIMIT + 1}`)).toBeInTheDocument();
    await expect(canvas.queryByText('Listing Item 1')).not.toBeInTheDocument();
  },
};

/**
 * Loading state showing the 3-column skeleton grid.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * View when the seller has no listings yet.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 } },
          });
        }),
      ],
    },
  },
};

/**
 * Error state when the API fails to return listings.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/me', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load listings data/i)).toBeInTheDocument();
  },
};
