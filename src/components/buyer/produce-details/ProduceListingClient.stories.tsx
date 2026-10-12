import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ProduceListingClient from './ProduceListingClient';

import { MOCK_PRODUCE_DETAILS } from '@/lib/storybook/mocks/produce.mock';

const mockedQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const MOCK_ID = 'prod_123';

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
          return HttpResponse.json(MOCK_PRODUCE_DETAILS);
        }),
        // Mocking reviews call since ProduceListingClient renders ProduceReviews
        http.get(`*/api/users/${MOCK_PRODUCE_DETAILS.seller.id}/reviews`, () => {
          return HttpResponse.json({ reviews: [], meta: {} });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Verify page loads data
    await expect(await canvas.findByText(MOCK_PRODUCE_DETAILS.title)).toBeInTheDocument();

    // 2. Click Order Now
    const orderBtn = canvas.getByRole('button', { name: /order now/i });
    await userEvent.click(orderBtn);

    const body = within(document.body);
    await expect(
      await body.findByText(`Order Form for ${MOCK_PRODUCE_DETAILS.title}`),
    ).toBeInTheDocument();
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
