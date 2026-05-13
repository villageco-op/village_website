import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ProduceReviews from './ProduceReviews';

import type { SellerReviewItem } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_SELLER_ID = 'seller-abc-123';
const MOCK_PRODUCE_ID = 'produce-xyz-789';

const generateMockReviews = (count: number): SellerReviewItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i}`,
    rating: (i % 3) + 3, // Randomish 3-5 star ratings
    comment:
      i % 2 === 0
        ? `These are the best tomatoes I've ever had! Super fresh. (Review ${i + 1})`
        : `Really good quality, though shipping took an extra day. (Review ${i + 1})`,
    createdAt: new Date(Date.now() - i * 3600000 * 24).toISOString(), // One day apart
    buyer: {
      id: `buyer-${i}`,
      name: i % 2 === 0 ? 'Alice Farmer' : 'Bob Gardener',
      image: '',
    },
  }));
};

const meta: Meta<typeof ProduceReviews> = {
  title: 'Buyer/ProduceDetails/ProduceReviews',
  component: ProduceReviews,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <div className="max-w-2xl mx-auto">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ProduceReviews>;

/**
 * Standard view with several reviews.
 */
export const Default: Story = {
  args: {
    sellerId: MOCK_SELLER_ID,
    produceId: MOCK_PRODUCE_ID,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${MOCK_SELLER_ID}/reviews`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              reviews: generateMockReviews(3),
              pagination: { total: 3, page: 1, limit: 5, totalPages: 1 },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Product Reviews')).toBeInTheDocument();
    await expect(await canvas.findAllByText('Alice Farmer')).toHaveLength(2);
    await expect(await canvas.findByText(/Review 1/)).toBeInTheDocument();
  },
};

/**
 * Empty state when no reviews exist for this specific product.
 */
export const NoReviews: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${MOCK_SELLER_ID}/reviews`, () => {
          return HttpResponse.json({
            status: 200,
            data: {
              reviews: [],
              pagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
            },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText(/No reviews yet/i)).toBeInTheDocument();
  },
};

/**
 * Loading state showing the Skeleton component.
 */
export const Loading: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${MOCK_SELLER_ID}/reviews`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state (handled gracefully by showing "No reviews" or similar logic
 * depending on your error boundary setup, but here it follows the isLoading logic).
 */
export const Error: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${MOCK_SELLER_ID}/reviews`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
