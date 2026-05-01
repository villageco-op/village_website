import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BrowseProduceMapClient from './BrowseProduceMapClient';

import { type ProduceType, Season } from '@/lib/api/generated/models';

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

/**
 * Mock data representing clusters of sellers around the default coordinates.
 */
const MOCK_MAP_DATA = [
  {
    sellerId: 'user-123',
    name: 'Joe Farmer',
    lat: 41.602,
    lng: -87.3371,
    produce: [
      {
        id: 'prod-1',
        name: 'Honeycrisp Apples',
        type: 'stone_fruits' as ProduceType,
        thumbnail:
          'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=100&h=100&fit=crop',
        price: '0.15',
        availableInventory: '320', // 20 lbs
        availableBy: new Date().toISOString(),
        seasonStart: Season.spring,
        seasonEnd: Season.summer,
        isSubscribable: true,
      },
    ],
  },
  {
    sellerId: 'user-456',
    name: 'Jane',
    lat: 41.615,
    lng: -87.35,
    produce: [
      {
        id: 'prod-2',
        name: 'Wild Arugula',
        type: 'leafy_greens' as ProduceType,
        thumbnail: '',
        price: '0.45',
        availableInventory: '80', // 5 lbs
        availableBy: new Date().toISOString(),
        seasonStart: Season.spring,
        seasonEnd: Season.summer,
        isSubscribable: false,
      },
    ],
  },
];

const AUTH_HANDLER = http.get('*/api/auth/session', () => {
  return HttpResponse.json(AUTH_SESSION_MOCK);
});

const meta: Meta<typeof BrowseProduceMapClient> = {
  title: 'Buyer/BrowseProduce/Map/BrowseProduceMapClient',
  component: BrowseProduceMapClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="flex flex-col h-screen w-full p-4 bg-slate-100">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BrowseProduceMapClient>;

/**
 * The standard view showing pins on the map.
 */
export const Default: Story = {
  args: {
    onViewChange: fn(),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/map', () => {
          return HttpResponse.json({
            status: 200,
            data: MOCK_MAP_DATA,
          });
        }),
        AUTH_HANDLER,
      ],
    },
  },
};

/**
 * Loading state showing the spinner overlay over the map area.
 */
export const Loading: Story = {
  args: {
    onViewChange: fn(),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/map', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        AUTH_HANDLER,
      ],
    },
  },
};

/**
 * State shown when the API returns an empty list (e.g., no growers in range).
 */
export const NoResults: Story = {
  args: {
    onViewChange: fn(),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/map', () => {
          return HttpResponse.json({
            status: 200,
            data: [],
          });
        }),
        AUTH_HANDLER,
      ],
    },
  },
};

/**
 * Error state when the API call fails.
 */
export const Error: Story = {
  args: {
    onViewChange: fn(),
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/map', () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.get('*/api/auth/session', () => HttpResponse.json({})),
      ],
    },
  },
};
