import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import SellerReviewsTab from './SellerReviewsTab';

import type { PublicUserProfile } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const SELLER_ID = 'seller_123';

const MOCK_PROFILE: PublicUserProfile = {
  id: SELLER_ID,
  name: 'Green Valley Farm',
  organization: null,
  image: '',
  aboutMe: 'Organic produce from the heart of the valley.',
  specialties: ['Leafy Greens', 'Root Vegetables'],
  city: 'Austin',
  state: 'TX',
  country: 'USA',
  joinedAt: '2024-01-01T00:00:00Z',
  starRating: 4.8,
  totalReviews: 25,
  activeBuyerCount: 10,
  reviewBreakdown: {
    '5': 20,
    '4': 3,
    '3': 2,
    '2': 0,
    '1': 0,
  },
};

const generateMockReviews = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev_${i + 1}`,
    rating: i % 5 === 0 ? 4 : 5,
    comment:
      i % 3 === 0
        ? `The produce from this farm is always fresh and delicious. Highly recommend the spinach! (Review ${i + 1})`
        : `Great quality and fast delivery. (Review ${i + 1})`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    buyer: {
      id: `buyer_${i}`,
      name: i % 2 === 0 ? 'Jane Doe' : 'John Smith',
    },
  }));
};

const ALL_REVIEWS = generateMockReviews(25);

const meta: Meta<typeof SellerReviewsTab> = {
  title: 'Seller/Profile/SellerReviewsTab',
  component: SellerReviewsTab,
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
          <div className="max-w-4xl mx-auto">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SellerReviewsTab>;

/**
 * Standard view with a list of reviews and rating breakdown.
 */
export const Default: Story = {
  args: {
    sellerId: SELLER_ID,
    profile: MOCK_PROFILE,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${SELLER_ID}/reviews`, () => {
          return HttpResponse.json({
            reviews: ALL_REVIEWS.slice(0, 10),
            pagination: { total: 25, page: 1, limit: 10, totalPages: 3 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('4.8')).toBeInTheDocument();
    await expect(canvas.getByText('Based on 25 reviews')).toBeInTheDocument();
    await expect((await canvas.findAllByText('Jane Doe'))[0]).toBeInTheDocument();
  },
};

/**
 * Pagination functionality testing.
 */
export const Paginated: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${SELLER_ID}/reviews`, ({ request }) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page') || '1');
          const limit = 10;
          const start = (page - 1) * limit;
          const items = ALL_REVIEWS.slice(start, start + limit);

          return HttpResponse.json({
            reviews: items,
            pagination: { total: ALL_REVIEWS.length, page, limit, totalPages: 3 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check Page 1 content
    await expect(await canvas.findByText('(Review 1)', { exact: false })).toBeInTheDocument();

    // Click Next Page
    const nextButton = await canvas.findByRole('button', { name: /next|2/i });
    await userEvent.click(nextButton);

    // Check Page 2 content
    await expect(await canvas.findByText('(Review 11)', { exact: false })).toBeInTheDocument();
    await expect(canvas.queryByText('(Review 1)', { exact: false })).not.toBeInTheDocument();
  },
};

/**
 * Loading state with skeletons.
 */
export const Loading: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${SELLER_ID}/reviews`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * View when a seller has no reviews yet.
 */
export const NoReviews: Story = {
  args: {
    ...Default.args,
    profile: {
      ...MOCK_PROFILE,
      starRating: 0,
      totalReviews: 0,
      reviewBreakdown: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${SELLER_ID}/reviews`, () => {
          return HttpResponse.json({
            reviews: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
          });
        }),
      ],
    },
  },
};

/**
 * Error state when the reviews API fails.
 */
export const ErrorState: Story = {
  args: { ...Default.args },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/users/${SELLER_ID}/reviews`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
