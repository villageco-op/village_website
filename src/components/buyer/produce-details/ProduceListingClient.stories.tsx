import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ProduceListingClient from './ProduceListingClient';

import type { ProduceDetail } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const MOCK_ID = 'prod_123';

const MOCK_PRODUCE: ProduceDetail = {
  id: MOCK_ID,
  sellerId: 'seller_99',
  title: 'Organic Honeycrisp Apples',
  description: 'Crisp, sweet, and locally grown without pesticides.',
  pricePerOz: '0.25',
  totalOzInventory: '500',
  availableBy: '2026-05-20',
  harvestFrequencyDays: 7,
  seasonStart: '2026-04-01',
  seasonEnd: '2026-10-01',
  images: [],
  isSubscribable: true,
  status: 'active',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  produceType: 'stone_fruits',
  maxOrderQuantityOz: '1',
  seller: {
    id: 'seller_99',
    name: 'Sunshine Orchards',
    organization: null,
    image: '',
    canDeliver: true,
    deliveryRangeMiles: 15,
    location: {
      city: 'Austin',
      state: 'TX',
      lat: 30.2672,
      lng: -97.7431,
      address: '123 Farm Road',
      country: 'USA',
      zip: '78701',
    },
  },
};

const meta: Meta<typeof ProduceListingClient> = {
  title: 'Buyer/ProduceDetails/ProduceListingClient',
  component: ProduceListingClient,
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
type Story = StoryObj<typeof ProduceListingClient>;

export const Default: Story = {
  args: { id: MOCK_ID },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, () => {
          return HttpResponse.json(MOCK_PRODUCE);
        }),
        // Mocking reviews call since ProduceListingClient renders ProduceReviews
        http.get(`*/api/users/${MOCK_PRODUCE.seller.id}/reviews`, () => {
          return HttpResponse.json({ reviews: [], meta: {} });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Verify page loads data
    await expect(await canvas.findByText(MOCK_PRODUCE.title)).toBeInTheDocument();

    // 2. Click Order Now
    const orderBtn = canvas.getByRole('button', { name: /order now/i });
    await userEvent.click(orderBtn);

    // 3. Verify Modal Appears (checking for text inside VisuallyHidden/Dialog)
    // Note: In Storybook/JSDOM, Radix dialogs render in a Portal.
    // We search the body/screen if necessary, or canvas if not portalled.
    const body = within(document.body);
    await expect(await body.findByText(`Order Form for ${MOCK_PRODUCE.title}`)).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: { id: MOCK_ID },
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/produce/${MOCK_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const NotFound: Story = {
  args: { id: 'wrong-id' },
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/produce/wrong-id', () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};
