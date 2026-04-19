import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerGrowersClient from './BuyerGrowersClient';

import type { GrowersResponse } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_GROWERS: { data: GrowersResponse; status: number } = {
  status: 200,
  data: {
    data: [
      {
        sellerId: 'grower-1',
        name: 'Sun-Kissed Orchards',
        city: 'Austin',
        location: {
          lat: 30.2672,
          lng: -97.7431,
          address: '456 Apple Way',
          city: 'Austin',
          state: 'TX',
          country: 'United States',
          zip: '92921',
        },
        produceTypesOrdered: ['Apples', 'Pears', 'Cider'],
        amountOrderedThisMonthLbs: 120,
        daysSinceFirstOrder: 365,
        firstOrderDate: '2023-04-18T00:00:00Z',
      },
      {
        sellerId: 'grower-2',
        name: 'Rooted Earth Farm',
        city: 'Austin',
        location: {
          lat: 30.2672,
          lng: -97.7431,
          address: '789 Dirt Road',
          city: 'Austin',
          state: 'TX',
          country: 'United States',
          zip: '92921',
        },
        produceTypesOrdered: ['Carrots', 'Radishes'],
        amountOrderedThisMonthLbs: 15.2,
        daysSinceFirstOrder: 45,
        firstOrderDate: '2026-03-04T00:00:00Z',
      },
    ],
    meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
  },
};

const meta: Meta<typeof BuyerGrowersClient> = {
  title: 'Buyer/Growers/GrowersPage',
  component: BuyerGrowersClient,
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
          <div className="min-h-screen bg-background">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerGrowersClient>;

/**
 * Standard view with multiple growers.
 * Note how "All Austin" is derived from the shared city.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return HttpResponse.json(MOCK_GROWERS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check header logic
    await expect(await canvas.findByText(/2 active relationships/i)).toBeInTheDocument();
    await expect(canvas.getByText(/All Austin/i)).toBeInTheDocument();
    // Check card rendering
    await expect(canvas.getByText('Sun-Kissed Orchards')).toBeInTheDocument();
    await expect(canvas.getByText('Rooted Earth Farm')).toBeInTheDocument();
  },
};

/**
 * Displays the "Multiple locations" subtitle logic when growers are from different cities.
 */
export const MixedLocations: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          const mixedData = JSON.parse(JSON.stringify(MOCK_GROWERS));
          mixedData.data.data[1].city = 'San Antonio';
          return HttpResponse.json(mixedData);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Multiple locations/i)).toBeInTheDocument();
  },
};

/**
 * Loading state utilizing the GrowersSkeleton.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Empty state for users who haven't made any purchases yet.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return HttpResponse.json({
            data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
            status: 200,
          });
        }),
      ],
    },
  },
};

/**
 * Error state when the API request fails.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/Failed to load your growers/i)).toBeInTheDocument();
  },
};
