import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import BuyerProfile from './BuyerProfileClient';

import { MOCK_BUYER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';
import {
  createPaginatedResponse,
  generateMockProduceListItems,
  generateMockReviews,
} from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const BUYER_ID = MOCK_BUYER_PUBLIC_PROFILE.id;
const MOCK_PRODUCE_LIST_ITEMS = generateMockProduceListItems(5);
const MOCK_REVIEWS = generateMockReviews(42);

const meta: Meta<typeof BuyerProfile> = {
  title: 'Profile/BuyerProfilePage',
  component: BuyerProfile,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
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
type Story = StoryObj<typeof BuyerProfile>;

/**
 * The complete buyer profile experience including data fetching and tab navigation.
 */
export const Default: Story = {
  args: { buyerId: BUYER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/buyer/${BUYER_ID}`, () => {
          return HttpResponse.json(MOCK_BUYER_PUBLIC_PROFILE);
        }),
        http.get('*/api/produce/list', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_PRODUCE_LIST_ITEMS));
        }),
        http.get(`*/api/users/${BUYER_ID}/reviews`, () => {
          return HttpResponse.json({
            reviews: MOCK_REVIEWS,
            meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
          });
        }),
      ],
    },
  },
};

/**
 * Demonstrates the skeleton loading states for the entire page.
 */
export const PageLoading: Story = {
  args: { buyerId: BUYER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/buyer/${BUYER_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * State shown when the buyer ID doesn't exist or API fails.
 */
export const NotFound: Story = {
  args: { buyerId: 'non-existent' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/buyer/*', () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};

/**
 * Responsive check for mobile devices.
 */
export const MobileView: Story = {
  args: { ...Default.args },
  parameters: {
    ...Default.parameters,
    viewport: { defaultViewport: 'mobile1' },
  },
};
