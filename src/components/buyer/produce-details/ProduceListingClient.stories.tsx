import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import ProduceListingClient from './ProduceListingClient';

import { BASE_MOCK_ORDER, BASE_MOCK_ORDER_LIST_ITEM } from '@/lib/storybook/mocks/order.mock';
import { MOCK_PRODUCE_DETAILS } from '@/lib/storybook/mocks/produce.mock';
import { BASE_MOCK_SUBSCRIPTION } from '@/lib/storybook/mocks/subscription.mock';
import { createPaginatedResponse } from '@/lib/storybook/utils/mockGenerators';

const mockedQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const MOCK_ID = BASE_MOCK_ORDER_LIST_ITEM.id;

const MOCK_ORDERS = [
  {
    ...BASE_MOCK_ORDER,
    id: 'ord_active_1',
    status: 'pending',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    ...BASE_MOCK_ORDER,
    id: 'ord_past_1',
    status: 'completed',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_SUBS = [
  {
    ...BASE_MOCK_SUBSCRIPTION,
    id: 'sub_active_1',
    productId: MOCK_ID,
    status: 'active',
    quantityOz: 16,
    fulfillmentType: 'delivery',
    updatedAt: new Date().toISOString(),
  },
  {
    ...BASE_MOCK_SUBSCRIPTION,
    id: 'sub_past_1',
    productId: MOCK_ID,
    status: 'canceled',
    quantityOz: 8,
    fulfillmentType: 'pickup',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

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
        http.get(`*/api/users/${MOCK_PRODUCE_DETAILS.seller.id}/reviews`, () => {
          return HttpResponse.json({ reviews: [], meta: {} });
        }),
        http.get('*/api/orders', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_ORDERS));
        }),
        http.get('*/api/subscriptions', () => {
          return HttpResponse.json(createPaginatedResponse(MOCK_SUBS));
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
