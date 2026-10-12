import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { SupplyMapCard } from './SupplyMapCard';

import { MOCK_GROWERS_LIST } from '@/lib/storybook/mocks/grower.mock';
import { generateMockGrowers } from '@/lib/storybook/utils/mockGenerators';

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

/**
 * Standard state showing several active growers on the map.
 */
export const Default: Story = {
  args: {
    localGrowersSupplying: 3,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/growers/growers-map*', () => {
          return HttpResponse.json(MOCK_GROWERS_LIST);
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
  },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/growers/growers-map*', () => {
          const denseGrowers = generateMockGrowers(12);
          return HttpResponse.json(denseGrowers);
        }),
      ],
    },
  },
};
