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

const MOCK_GROWERS = [
  {
    sellerId: 'grower-1',
    name: 'Sunshine Farms',
    lat: 41.615,
    lng: -87.35,
    image: 'https://i.pravatar.cc/150?u=1',
    rating: 4.8,
    city: 'Gary',
    distanceMiles: 2.4,
    specialties: ['Microgreens', 'Heirloom Tomatoes', 'Herbs'],
  },
  {
    sellerId: 'grower-2',
    name: 'Lakeview Orchards',
    lat: 41.585,
    lng: -87.31,
    image: null,
    rating: 0,
    city: 'Miller Beach',
    distanceMiles: 5.1,
    specialties: ['Apples', 'Peaches'],
  },
  {
    sellerId: 'grower-3',
    name: 'Green Thumb Gardens',
    lat: 41.605,
    lng: -87.38,
    image: 'https://i.pravatar.cc/150?u=3',
    rating: 4.5,
    city: 'Hammond',
    distanceMiles: 3.8,
    specialties: ['Organic Kale', 'Root Vegetables'],
  },
];

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
        http.get('*/api/growers/growers-map*', () => {
          return HttpResponse.json(MOCK_GROWERS);
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
        http.get('*/api/growers/growers-map*', async () => {
          await delay('infinite');
          return HttpResponse.json([]);
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
        http.get('*/api/growers/growers-map*', () => {
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
        http.get('*/api/growers/growers-map*', () => {
          const specialtyPool = ['Berries', 'Mushrooms', 'Honey', 'Flowers', 'Squash', 'Eggs'];
          const cities = ['Gary', 'Hammond', 'Hobart', 'Merrillville', 'East Chicago'];

          // Generate pseudo-random growers around Gary, IN
          const denseGrowers = Array.from({ length: 12 }).map((_, i) => ({
            sellerId: `grower-${i}`,
            name: `Grower ${i}`,
            lat: 41.602 + (Math.random() - 0.5) * 0.1,
            lng: -87.3371 + (Math.random() - 0.5) * 0.1,
            image: null,
            rating: Math.random() * 2 + 3, // Random rating between 3.0 and 5.0
            city: cities[Math.floor(Math.random() * cities.length)],
            distanceMiles: parseFloat((Math.random() * 10 + 1).toFixed(1)),
            specialties: specialtyPool.sort(() => 0.5 - Math.random()).slice(0, 2),
          }));
          return HttpResponse.json(denseGrowers);
        }),
      ],
    },
  },
};
