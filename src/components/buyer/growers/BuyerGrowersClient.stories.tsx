import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerGrowersClient from './BuyerGrowersClient';

import type { GrowersResponse, ProduceType } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const PAGE_LIMIT = 12;

const generateMockGrowers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    sellerId: `grower-${i + 1}`,
    name: `Grower ${i + 1}`,
    organization: null,
    city: 'Austin',
    location: {
      lat: 30.2672,
      lng: -97.7431,
      address: `${i + 1} Green Lane`,
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      zip: '92921',
    },
    produceTypesOrdered: ['root_vegetables' as ProduceType],
    amountOrderedThisMonthLbs: 10,
    daysSinceFirstOrder: 100,
    firstOrderDate: '2024-01-01T00:00:00Z',
  }));
};

const PAGINATED_GROWERS_DATA = generateMockGrowers(25);

const MOCK_GROWERS: { data: GrowersResponse; status: number } = {
  status: 200,
  data: {
    data: PAGINATED_GROWERS_DATA.slice(0, 2),
    meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    cities: ['Austin'],
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
    await expect(await canvas.findByText(/2 active relationships/i)).toBeInTheDocument();
    await expect(canvas.getByText(/All Austin/i)).toBeInTheDocument();
    await expect(canvas.getByText('Grower 1')).toBeInTheDocument();
    await expect(canvas.getByText('Grower 2')).toBeInTheDocument();
  },
};

/**
 * Pagination state with multiple pages of growers.
 */
export const Paginated: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;
          const items = PAGINATED_GROWERS_DATA.slice(start, end);

          return HttpResponse.json({
            status: 200,
            data: {
              data: items,
              meta: {
                total: PAGINATED_GROWERS_DATA.length,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(PAGINATED_GROWERS_DATA.length / PAGE_LIMIT),
              },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Grower 1')).toBeInTheDocument();
    await expect(canvas.queryByText(`Grower ${PAGE_LIMIT + 1}`)).not.toBeInTheDocument();

    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    await expect(await canvas.findByText(`Grower ${PAGE_LIMIT + 1}`)).toBeInTheDocument();
    await expect(canvas.queryByText('Grower 1')).not.toBeInTheDocument();
  },
};

export const MixedLocations: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          const mixedData = JSON.parse(JSON.stringify(MOCK_GROWERS));
          mixedData.data.data[1].city = 'San Antonio';
          mixedData.data.cities = ['Austin', 'San Antonio'];
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

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/growers', () => {
          return HttpResponse.json({
            data: { data: [], meta: { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 } },
            status: 200,
          });
        }),
      ],
    },
  },
};

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
