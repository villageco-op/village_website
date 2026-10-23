import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerProfile from './SellerProfileClient';

import { MOCK_SELLER_PUBLIC_PROFILE } from '@/lib/storybook/mocks/user.mock';
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

const SELLER_ID = MOCK_SELLER_PUBLIC_PROFILE.id;
const MOCK_PRODUCE_LIST_ITEMS = generateMockProduceListItems(5);
const MOCK_REVIEWS = generateMockReviews(42);

const handlers = [
  http.get(`*/api/seller/${SELLER_ID}`, () => {
    return HttpResponse.json(MOCK_SELLER_PUBLIC_PROFILE);
  }),
  http.get('*/api/produce/list', () => {
    return HttpResponse.json(createPaginatedResponse(MOCK_PRODUCE_LIST_ITEMS));
  }),
  http.get(`*/api/users/${SELLER_ID}/reviews`, () => {
    return HttpResponse.json({
      reviews: MOCK_REVIEWS,
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });
  }),
];

const meta: Meta<typeof SellerProfile> = {
  title: 'Profile/SellerProfilePage',
  component: SellerProfile,
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
type Story = StoryObj<typeof SellerProfile>;

/**
 * The complete seller profile experience including data fetching and tab navigation.
 */
export const Default: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: { handlers },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if Hero rendered with name
    await expect(await canvas.findByText('Green Thumb Microgreens')).toBeInTheDocument();

    // Verify Default Tab (About)
    await expect(canvas.getByText(MOCK_SELLER_PUBLIC_PROFILE.aboutMe!)).toBeInTheDocument();

    // Check if Quick Order fetch populated cards correctly
    await waitFor(async () => {
      await expect(canvas.getByText(MOCK_PRODUCE_LIST_ITEMS[0].name)).toBeInTheDocument();
      await expect(canvas.getByText(MOCK_PRODUCE_LIST_ITEMS[1].name)).toBeInTheDocument();
      await expect(canvas.getByText(MOCK_PRODUCE_LIST_ITEMS[2].name)).toBeInTheDocument();
      await expect(canvas.getByText(MOCK_PRODUCE_LIST_ITEMS[3].name)).toBeInTheDocument();
    });

    // Test Tab Switching to Listings
    const listingsTab = canvas.getByRole('tab', { name: /listings/i });
    await userEvent.click(listingsTab);

    await expect(
      await canvas.findAllByText(MOCK_PRODUCE_LIST_ITEMS[0].description!),
    ).not.toHaveLength(0);
  },
};

/**
 * Demonstrates the skeleton loading states for the entire page.
 */
export const PageLoading: Story = {
  args: { sellerId: SELLER_ID },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/seller/${SELLER_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * State shown when the seller ID doesn't exist or API fails.
 */
export const NotFound: Story = {
  args: { sellerId: 'non-existent' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/seller/*', () => {
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
