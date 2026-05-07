import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import PublicSellerProfile from './PublicSellerProfileClient';

import type { PublicUserProfile } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const SELLER_ID = 'seller_village_123';

const MOCK_PROFILE: PublicUserProfile = {
  id: SELLER_ID,
  name: 'Oak Creek Organics',
  image: '',
  aboutMe:
    'We are a small family-run farm specializing in heirloom vegetables and sustainable growing practices. Our mission is to bring the freshest, most nutrient-dense produce directly to our neighbors.',
  specialties: ['Heirloom Tomatoes', 'Organic Kale', 'Microgreens'],
  city: 'Austin',
  state: 'TX',
  country: 'USA',
  joinedAt: '2023-05-15T00:00:00Z',
  starRating: 4.9,
  totalReviews: 42,
  activeBuyerCount: 15,
  reviewBreakdown: { '5': 38, '4': 3, '3': 1, '2': 0, '1': 0 },
};

const handlers = [
  http.get(`*/api/users/${SELLER_ID}`, () => {
    return HttpResponse.json({ data: MOCK_PROFILE, status: 200 });
  }),
  http.get('*/api/produce/list', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        data: [
          {
            id: 'p1',
            thumbnail: null,
            name: 'Baby Spinach',
            sellerName: 'Oak Creek Organics',
            sellerId: SELLER_ID,
            price: '$3.50/lb',
            amount: '20 lbs',
            availableBy: new Date().toISOString(),
            distance: 5,
            isSubscribable: true,
            description: 'Tender baby spinach leaves.',
          },
          {
            id: 'p2',
            thumbnail: null,
            name: 'Cherry Tomatoes',
            sellerName: 'Oak Creek Organics',
            sellerId: SELLER_ID,
            price: '$4.10/lb',
            amount: '30 lbs',
            availableBy: new Date().toISOString(),
            distance: 5,
            isSubscribable: false,
            description: 'Sweet and juicy cherry tomatoes.',
          },
        ],
        meta: { total: 2, page: 1, limit: 12, totalPages: 1 },
      },
    });
  }),
  http.get(`*/api/users/${SELLER_ID}/reviews`, () => {
    return HttpResponse.json({
      status: 200,
      data: {
        reviews: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      },
    });
  }),
];

const meta: Meta<typeof PublicSellerProfile> = {
  title: 'Seller/Profile/FullProfilePage',
  component: PublicSellerProfile,
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
type Story = StoryObj<typeof PublicSellerProfile>;

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
    await expect(await canvas.findByText('Oak Creek Organics')).toBeInTheDocument();

    // Verify Stats Row
    await expect(canvas.getByText('15 buyers')).toBeInTheDocument();

    // Verify Default Tab (About)
    await expect(canvas.getByText(/About Oak/i)).toBeInTheDocument();

    // Check if Quick Order fetch populated cards correctly
    await waitFor(async () => {
      await expect(canvas.getByText('Baby Spinach')).toBeInTheDocument();
      await expect(canvas.getByText('Cherry Tomatoes')).toBeInTheDocument();
    });

    // Test Tab Switching to Listings
    const listingsTab = canvas.getByRole('tab', { name: /listings/i });
    await userEvent.click(listingsTab);

    await expect(await canvas.findByText('Current & Upcoming Listings')).toBeInTheDocument();
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
        http.get(`*/api/users/${SELLER_ID}`, async () => {
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
        http.get('*/api/users/*', () => {
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
