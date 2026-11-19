import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerListingsClient from '../listings/SellerListingsClient';

import { AuthProvider } from '@/hooks/useAuth';
import {
  createPaginatedResponse,
  generateMockListings,
} from '@/lib/storybook/utils/mockGenerators';

const PAGE_LIMIT = 12;
const MOCK_LISTINGS_DATA = generateMockListings(25);

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
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="min-h-screen bg-background p-8">
              <div className="mx-auto max-w-6xl">
                <Story />
              </div>
            </div>
          </AuthProvider>
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
          return HttpResponse.json(createPaginatedResponse(MOCK_LISTINGS_DATA, 1, PAGE_LIMIT));
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/25 active/i)).toBeInTheDocument();
    await expect(canvas.getByText(MOCK_LISTINGS_DATA[0].title)).toBeInTheDocument();
    await expect(canvas.getByText(/Add a new listing/i)).toBeInTheDocument();
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
            data: [],
            meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 },
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
