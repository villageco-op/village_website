import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { SupplyMapCard } from './SupplyMapCard';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof SupplyMapCard> = {
  title: 'Buyer/Dashboard/SupplyMapCard',
  component: SupplyMapCard,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="max-w-2xl mx-auto">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SupplyMapCard>;

const MOCK_GROWERS = {
  data: [
    {
      sellerId: 'grower-1',
      name: 'Sunshine Farms',
      location: { lat: 41.615, lng: -87.35, address: '123 Corn St' },
      city: 'Gary',
      produceTypesOrdered: ['Corn', 'Tomatoes'],
      amountOrderedThisMonthLbs: 150,
      daysSinceFirstOrder: 200,
      firstOrderDate: '2023-01-01T00:00:00Z',
    },
    {
      sellerId: 'grower-2',
      name: 'Lakeview Orchards',
      location: { lat: 41.585, lng: -87.31, address: '456 Apple Ln' },
      city: 'Gary',
      produceTypesOrdered: ['Apples'],
      amountOrderedThisMonthLbs: 50,
      daysSinceFirstOrder: 45,
      firstOrderDate: '2024-02-15T00:00:00Z',
    },
    {
      sellerId: 'grower-3',
      name: 'Green Thumb Gardens',
      location: { lat: 41.605, lng: -87.38, address: '789 Leafy Way' },
      city: 'Gary',
      produceTypesOrdered: ['Kale', 'Spinach'],
      amountOrderedThisMonthLbs: 85,
      daysSinceFirstOrder: 365,
      firstOrderDate: '2023-04-20T00:00:00Z',
    },
  ],
};

/**
 * Standard state showing several active growers on the map.
 */
export const Default: Story = {
  args: {
    localGrowersSupplying: 3,
    avgGrowerDistanceMiles: 4.2,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return HttpResponse.json({ status: 200, data: MOCK_GROWERS });
        }),
      ],
    },
  },
};

/**
 * Loading state using the Skeleton UI.
 */
export const Loading: Story = {
  args: {
    localGrowersSupplying: 0,
    avgGrowerDistanceMiles: 0,
  },
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
 * Error state when the grower API fails to resolve.
 */
export const ErrorState: Story = {
  args: {
    localGrowersSupplying: 3,
    avgGrowerDistanceMiles: 5.5,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

/**
 * State with a larger sourcing network to test marker density.
 */
export const LargeNetwork: Story = {
  args: {
    localGrowersSupplying: 12,
    avgGrowerDistanceMiles: 8.7,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          // Generate pseudo-random growers around Gary, IN
          const denseGrowers = Array.from({ length: 12 }).map((_, i) => ({
            sellerId: `grower-${i}`,
            name: `Grower ${i}`,
            location: {
              lat: 41.602 + (Math.random() - 0.5) * 0.1,
              lng: -87.3371 + (Math.random() - 0.5) * 0.1,
            },
          }));
          return HttpResponse.json({ status: 200, data: { data: denseGrowers } });
        }),
      ],
    },
  },
};
