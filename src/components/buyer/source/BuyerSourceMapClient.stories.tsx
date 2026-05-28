'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerSourceMapClient from './BuyerSourceMapClient';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const MOCK_USER = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane@example.com',
  city: 'Madison',
  lat: 43.0731,
  lng: -89.4012,
  specialties: {},
};

const MOCK_SESSION = {
  user: MOCK_USER,
  expires: '2026-12-31T23:59:59Z',
};

const MOCK_NODES = [
  {
    sellerId: 's1',
    name: 'Green Valley Organics',
    lat: 43.095,
    lng: -89.35,
    totalVolumeOz: 1200,
    totalSpend: 450,
    primaryProduceType: 'Leafy Greens',
    produceCategories: ['Kale', 'Spinach'],
  },
  {
    sellerId: 's2',
    name: 'Hilltop Orchard',
    lat: 43.03,
    lng: -89.48,
    totalVolumeOz: 2500,
    totalSpend: 890,
    primaryProduceType: 'Fruits',
    produceCategories: ['Apples'],
  },
];

const MOCK_ANALYTICS = {
  totalSpend: 1340,
  totalVolumeOz: 3700,
  uniqueGrowers: 2,
  foodMilesSaved: 1250,
  produceBreakdown: [
    { produceType: 'Fruits', volumeOz: 2500, percentage: 68 },
    { produceType: 'Leafy Greens', volumeOz: 1200, percentage: 32 },
  ],
};

const meta: Meta<typeof BuyerSourceMapClient> = {
  title: 'Buyer/SourceMap/SourceMapPage',
  component: BuyerSourceMapClient,
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
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof BuyerSourceMapClient>;

/**
 * Default state: Map is populated with nodes and the sidebar shows analytics.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/auth/session', () => {
          return HttpResponse.json(MOCK_SESSION);
        }),
        http.get('*/api/source-map/nodes', () => {
          return HttpResponse.json(MOCK_NODES);
        }),
        http.get('*/api/source-map/analytics', () => {
          return HttpResponse.json(MOCK_ANALYTICS);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify sidebar loaded analytics
    await expect(await canvas.findByText('$1,340')).toBeInTheDocument();
    await expect(canvas.getByText(/local neighbors/i)).toBeInTheDocument();
  },
};

/**
 * Loading state: Shows the skeleton UI in the sidebar.
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/auth/session', () => HttpResponse.json(MOCK_SESSION)),
        http.get('*/api/source-map/nodes', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
        http.get('*/api/source-map/analytics', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Empty state: No sourcing data found for the current filters.
 */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/auth/session', () => HttpResponse.json(MOCK_SESSION)),
        http.get('*/api/source-map/nodes', () => {
          return HttpResponse.json([], { status: 200 });
        }),
        http.get('*/api/source-map/analytics', () => {
          return HttpResponse.json({
            ...MOCK_ANALYTICS,
            totalSpend: 0,
            uniqueGrowers: 0,
            produceBreakdown: [],
          });
        }),
      ],
    },
  },
};

/**
 * Error state: Triggered if the API returns a 500 or malformed response.
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/source-map/nodes', () => new HttpResponse(null, { status: 500 })),
        http.get('*/api/source-map/analytics', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};

/**
 * Unauthenticated state: Tests how the component behaves if session is null.
 */
export const Unauthenticated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/auth/session', () => HttpResponse.json({})),
        http.get('*/api/source-map/nodes', () => HttpResponse.json(null, { status: 200 })),
        http.get('*/api/source-map/analytics', () => HttpResponse.json(null, { status: 200 })),
      ],
    },
  },
};
