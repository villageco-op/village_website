'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BrowseProduceListClient from './BrowseProduceListClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_USER = {
  id: 'user-buyer-999',
  name: 'John Buyer',
  email: 'john@example.com',
  emailVerified: new Date().toISOString(),
  image:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces',
  aboutMe: 'I love local fresh produce!',
  specialties: [], // Assuming UserSpecialties is an array
  goal: 'Eat healthy',
  address: '123 Main St',
  city: 'Gary',
  state: 'IN',
  country: 'USA',
  zip: '46401',
  lat: 41.602,
  lng: -87.3371,
  deliveryRangeMiles: '10',
  stripeAccountId: 'acct_123',
  stripeOnboardingComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AUTH_SESSION_MOCK = {
  user: MOCK_USER,
  expires: '2026-12-31T23:59:59.999Z',
};

const generateMockProduce = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    thumbnail: null,
    name: `Fresh Item ${i + 1}`,
    sellerName: `Grower ${i + 1}`,
    sellerId: `seller-${i + 1}`,
    price: (0.15 + i * 0.01).toFixed(2),
    amount: (16 + i).toString(),
    availableBy: new Date().toISOString(),
    distance: 1.5 + i,
    isSubscribable: i % 2 === 0,
  }));
};

const PAGINATED_DATA = generateMockProduce(45);

const AUTH_HANDLER = http.get('*/api/auth/session', () => {
  return HttpResponse.json(AUTH_SESSION_MOCK);
});

const meta: Meta<typeof BrowseProduceListClient> = {
  title: 'Buyer/BrowseProduce/List/BrowseProduceListPage',
  component: BrowseProduceListClient,
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
          <div className="min-h-screen bg-slate-50">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceListClient>;

/**
 * Standard view with mocked data.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
          return HttpResponse.json({
            status: 200,
            data: {
              data: PAGINATED_DATA.slice(0, 20),
              meta: { total: 45, page: 1, limit: 20, totalPages: 3 },
            },
          });
        }),
        AUTH_HANDLER,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Fresh Item 1')).toBeInTheDocument();
  },
};

/**
 * Tests the search debouncing and filtering logic.
 */
export const Searching: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search');

          const filtered = search
            ? PAGINATED_DATA.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            : PAGINATED_DATA;

          return HttpResponse.json({
            status: 200,
            data: {
              data: filtered.slice(0, 5),
              meta: { total: filtered.length, page: 1, limit: 20, totalPages: 1 },
            },
          });
        }),
        AUTH_HANDLER,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText(/Search items or growers/i);

    await userEvent.type(searchInput, 'Item 5');

    // Wait for debounce and MSW response
    await waitFor(
      async () => {
        await expect(canvas.getByText('Fresh Item 5')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  },
};

/**
 * Demonstrates the loading skeleton state.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        AUTH_HANDLER,
      ],
    },
  },
};

/**
 * No results found matching filters.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => {
          return HttpResponse.json({
            status: 200,
            data: { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } },
          });
        }),
        AUTH_HANDLER,
      ],
    },
  },
};

/**
 * API failure state.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/list', () => new HttpResponse(null, { status: 500 })),
        http.get('*/api/auth/session', () => HttpResponse.json({})),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load produce listings/i)).toBeInTheDocument();
  },
};
