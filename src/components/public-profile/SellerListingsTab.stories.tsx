import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerListingsTab from './SellerListingsTab';

import { generateMockListings } from '@/lib/storybook/utils/mockGenerators';

const SELLER_ID = 'seller_789';

const ALL_MOCK_LISTINGS = generateMockListings(30);

const meta: Meta<typeof SellerListingsTab> = {
  title: 'Profile/SellerListingsTab',
  component: SellerListingsTab,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
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
            filtered = ALL_MOCK_LISTINGS.filter((item) =>
              item.title.toLowerCase().includes(search),
            );
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

    await userEvent.type(searchInput, 'Listing Item 5');

    // Wait for debounce and API response
    await waitFor(
      async () => {
        await expect(canvas.getByText(/Listing Item 5/i)).toBeInTheDocument();
        await expect(canvas.queryByText(/Listing Item 1/i)).not.toBeInTheDocument();
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
