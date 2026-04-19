import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, within, expect } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { Toaster } from '../ui/sonner';

import OrderDetailClient from './OrderDetailClient';

import type { OrderDetailResponse } from '@/lib/api/generated/models';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MOCK_ORDER_ID = 'order_abc123';

const meta: Meta<typeof OrderDetailClient> = {
  title: 'Orders/OrderDetails/OrderDetailPage',
  component: OrderDetailClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    id: MOCK_ORDER_ID,
  },
  decorators: [
    (Story) => {
      mockedQueryClient.clear();
      return (
        <QueryClientProvider client={mockedQueryClient}>
          <Toaster />
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OrderDetailClient>;

const MOCK_ORDER_DATA: OrderDetailResponse = {
  id: MOCK_ORDER_ID,
  status: 'pending',
  fulfillmentType: 'delivery',
  paymentMethod: 'card',
  totalAmount: '42.50',
  scheduledTime: '2026-05-15T14:00:00Z',
  createdAt: '2026-05-10T09:30:00Z',
  buyerId: 'buyer_1',
  sellerId: 'seller_1',
  stripeReceiptUrl: null,
  updatedAt: '2026-05-10T09:30:00Z',
  cancelReason: null,
  buyer: {
    id: 'buyer_1',
    name: 'Alex Gardener',
    email: 'alex@example.com',
    location: {
      address: '742 Evergreen Terrace',
      lat: 41.5934,
      lng: -87.3464,
      city: 'Springfield',
      state: 'KY',
      country: 'United States',
      zip: '45638',
    },
  },
  seller: {
    id: 'seller_1',
    name: 'Springfield Community Plot',
    email: 'plots@springfield.org',
    location: {
      address: '123 Farm Road',
      lat: 41.6,
      lng: -87.35,
      city: 'Springfield',
      state: 'KY',
      country: 'United States',
      zip: '45638',
    },
  },
  items: [
    {
      id: 'item_1',
      productId: 'p1',
      productName: 'Organic Carrots',
      quantityOz: '48', // 3 lbs
      pricePerOz: '0.125', // $2.00/lb
    },
  ],
};

/**
 * Successful loading state with pending order (actions visible)
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json({ status: 200, data: MOCK_ORDER_DATA });
        }),
      ],
    },
  },
};

/**
 * Demonstrates the Skeleton loading state
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

/**
 * Error state (Order Not Found)
 */
export const NotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json({ status: 404 }, { status: 404 });
        }),
      ],
    },
  },
};

/**
 * Completed state (Action buttons hidden)
 */
export const CompletedOrder: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json({
            status: 200,
            data: { ...MOCK_ORDER_DATA, status: 'completed' },
          });
        }),
      ],
    },
  },
};

/**
 * Tests the full cancellation flow
 */
export const CancelFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`*/api/orders/${MOCK_ORDER_ID}`, () => {
          return HttpResponse.json({ status: 200, data: MOCK_ORDER_DATA });
        }),
        http.put(`*/api/orders/${MOCK_ORDER_ID}/cancel`, async () => {
          await delay(800);
          return HttpResponse.json({ status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cancelBtn = await canvas.findByRole('button', { name: /Cancel Order/i });
    await userEvent.click(cancelBtn);

    const body = within(canvasElement.ownerDocument.body);
    const textarea = body.getByPlaceholderText(/E.g., Out of stock/i);
    await userEvent.type(textarea, 'I accidentally ordered too many carrots.');

    const confirmBtn = body.getByRole('button', { name: /Confirm Cancellation/i });
    await userEvent.click(confirmBtn);

    await expect(
      await body.findByText(/Order has been canceled/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};

/**
 * Tests the rescheduling flow
 */
export const RescheduleFlow: Story = {
  parameters: {
    msw: {
      handlers: [
        ...Default.parameters!.msw.handlers,
        http.put(`*/api/orders/${MOCK_ORDER_ID}/schedule`, async () => {
          await delay(800);
          return HttpResponse.json({ status: 200 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rescheduleBtn = await canvas.findByRole('button', { name: /Reschedule/i });
    await userEvent.click(rescheduleBtn);

    const body = within(canvasElement.ownerDocument.body);

    const dateInput = await body.findByLabelText(/New Date & Time/i);

    if (!(dateInput as HTMLInputElement).value) {
      await userEvent.type(dateInput, '2026-05-20T10:00');
    }

    const confirmBtn = await body.findByRole('button', { name: /Propose New Time/i });

    await expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);

    await expect(
      await body.findByText(/Reschedule request sent successfully/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  },
};
